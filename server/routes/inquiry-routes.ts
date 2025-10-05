import type { Express, Request } from "express";
import { ZodError } from "zod";

import { insertInquirySchema, type InsertInquiry } from "../../shared/schema";
import { authenticate, AuthService } from "../auth-middleware";
import type { RequestWithId } from "../middleware/logging";
import { storage } from "../storage";
import { logError, logInfo, logWarn } from "../utils/logger";

const allowedInquiryStatuses = new Set(["unread", "read", "replied", "archived"]);

export function registerInquiryRoutes(app: Express) {
  const buildRequestContext = (req: Request) => {
    const requestWithId = req as Request & Partial<RequestWithId>;
    return {
      requestId: requestWithId.id,
      method: req.method,
      path: req.path,
    };
  };

  const parseNumericParam = (value: unknown, label: string): number => {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`${label} is required`);
    }

    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      throw new Error(`${label} must be a number`);
    }

    return parsed;
  };

  const sanitizeMessage = (value: unknown): string => {
    if (typeof value !== "string") {
      throw new Error("Message must be a string");
    }
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error("Message is required");
    }
    return trimmed;
  };

  app.post("/api/inquiries", authenticate, async (req, res) => {
    let propertyId: number;
    try {
      propertyId = parseNumericParam(String(req.body?.propertyId ?? ""), "Property id");
    } catch (validationError) {
      const message = validationError instanceof Error ? validationError.message : "Invalid property id";
      return res.status(400).json({ message });
    }

    try {
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const message = sanitizeMessage(req.body?.message);
      const payload: InsertInquiry = insertInquirySchema.parse({
        propertyId,
        buyerId: req.user!.id,
        message,
      });

      const inquiry = await storage.createInquiry(payload);
      logInfo("inquiry.create.success", {
        userId: req.user!.id,
        meta: {
          propertyId,
          inquiryId: inquiry.id,
          request: buildRequestContext(req),
        },
      });
      return res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof ZodError) {
        const userContext = req.user?.id !== undefined ? { userId: req.user.id } : {};
        logWarn("inquiry.create.validation_failed", {
          ...userContext,
          meta: { issues: error.issues, request: buildRequestContext(req) },
        });
        return res.status(400).json({ message: "Invalid inquiry payload", details: error.issues });
      }

      const userContext = req.user?.id !== undefined ? { userId: req.user.id } : {};
      logError("inquiry.create.failed", {
        ...userContext,
        meta: buildRequestContext(req),
        error,
      });
      return res.status(500).json({ message: "Unable to create inquiry" });
    }
  });

  app.get("/api/properties/:propertyId/inquiries", authenticate, async (req, res) => {
    let propertyId: number;
    try {
      propertyId = parseNumericParam(req.params.propertyId, "Property id");
    } catch (validationError) {
      const message = validationError instanceof Error ? validationError.message : "Invalid property id";
      return res.status(400).json({ message });
    }

    try {
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const currentUser = req.user!;
      const isOwner = property.ownerId === currentUser.id;
      const isAgent = property.agentId === currentUser.id;
      const isAdmin = AuthService.isAdmin(currentUser);

      if (!isOwner && !isAgent && !isAdmin) {
        return res.status(403).json({ message: "Not authorized to view inquiries for this property" });
      }

      const inquiries = await storage.getPropertyInquiries(propertyId);
      logInfo("inquiry.list.success", {
        userId: currentUser.id,
        meta: {
          propertyId,
          resultCount: inquiries.length,
          request: buildRequestContext(req),
        },
      });
      return res.json(inquiries);
    } catch (error) {
      const userContext = req.user?.id !== undefined ? { userId: req.user.id } : {};
      logError("inquiry.list.failed", {
        ...userContext,
        meta: buildRequestContext(req),
        error,
      });
      return res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.get("/api/users/:userId/inquiries", authenticate, async (req, res) => {
    let userId: number;
    try {
      userId = parseNumericParam(req.params.userId, "User id");
    } catch (validationError) {
      const message = validationError instanceof Error ? validationError.message : "Invalid user id";
      return res.status(400).json({ message });
    }

    try {
      const currentUser = req.user!;
      if (currentUser.id !== userId && !AuthService.isAdmin(currentUser)) {
        return res.status(403).json({ message: "Not authorized to view these inquiries" });
      }

      const inquiries = await storage.getUserInquiries(userId);
      logInfo("inquiry.user_list.success", {
        userId: currentUser.id,
        meta: {
          buyerId: userId,
          resultCount: inquiries.length,
          request: buildRequestContext(req),
        },
      });
      return res.json(inquiries);
    } catch (error) {
      const userContext = req.user?.id !== undefined ? { userId: req.user.id } : {};
      logError("inquiry.user_list.failed", {
        ...userContext,
        meta: buildRequestContext(req),
        error,
      });
      return res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.patch("/api/inquiries/:id/status", authenticate, async (req, res) => {
    let inquiryId: number;
    try {
      inquiryId = parseNumericParam(req.params.id, "Inquiry id");
    } catch (validationError) {
      const message = validationError instanceof Error ? validationError.message : "Invalid inquiry id";
      return res.status(400).json({ message });
    }

    try {
      const statusRaw = typeof req.body?.status === "string" ? req.body.status.trim().toLowerCase() : "";
      if (!statusRaw) {
        return res.status(400).json({ message: "Status is required" });
      }

      if (!allowedInquiryStatuses.has(statusRaw)) {
        return res.status(400).json({ message: `Status must be one of: ${Array.from(allowedInquiryStatuses).join(', ')}` });
      }

      const inquiry = await storage.getInquiry(inquiryId);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }

      const property = await storage.getProperty(inquiry.propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const currentUser = req.user!;
      const isOwner = property.ownerId === currentUser.id;
      const isAgent = property.agentId === currentUser.id;
      const isAdmin = AuthService.isAdmin(currentUser);

      if (!isOwner && !isAgent && !isAdmin) {
        return res.status(403).json({ message: "Not authorized to update this inquiry" });
      }

      const updated = await storage.updateInquiryStatus(inquiryId, statusRaw);
      if (!updated) {
        logError("inquiry.status.update_missing", {
          userId: currentUser.id,
          meta: {
            inquiryId,
            status: statusRaw,
            request: buildRequestContext(req),
          },
        });
        return res.status(500).json({ message: "Failed to update inquiry" });
      }

      logInfo("inquiry.status.updated", {
        userId: currentUser.id,
        meta: {
          inquiryId,
          status: statusRaw,
          request: buildRequestContext(req),
        },
      });
      return res.json(updated);
    } catch (error) {
      const userContext = req.user?.id !== undefined ? { userId: req.user.id } : {};
      logError("inquiry.status.failed", {
        ...userContext,
        meta: buildRequestContext(req),
        error,
      });
      return res.status(500).json({ message: "Failed to update inquiry" });
    }
  });
}

export default registerInquiryRoutes;
