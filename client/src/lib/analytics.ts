
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

class AnalyticsService {
  private isEnabled: boolean = true;
  private userId: string | null = null;

  constructor() {
    // Initialize with user ID if available
    this.setUserId(localStorage.getItem('userId'));
  }

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  private async sendEvent(eventData: AnalyticsEvent) {
    if (!this.isEnabled) return;

    const enrichedEvent = {
      ...eventData,
      userId: this.userId,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      page: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    };

    try {
      // Send to your analytics endpoint
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrichedEvent),
      });

      // Also send to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', enrichedEvent);
      }
    } catch (error) {
      console.warn('Failed to send analytics event:', error);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Search Events
  searchPerformed(query: string, filters: any, resultCount: number) {
    this.sendEvent({
      event: 'search_performed',
      properties: {
        query,
        filters,
        result_count: resultCount,
        search_type: 'property_search'
      }
    });
  }

  // Property Events
  propertyViewed(propertyId: string, propertyType: string, price: number, location: string) {
    this.sendEvent({
      event: 'pdp_viewed',
      properties: {
        property_id: propertyId,
        property_type: propertyType,
        price,
        location
      }
    });
  }

  propertyFavorited(propertyId: string, action: 'add' | 'remove') {
    this.sendEvent({
      event: 'property_favorited',
      properties: {
        property_id: propertyId,
        action
      }
    });
  }

  propertyCompared(propertyIds: string[]) {
    this.sendEvent({
      event: 'properties_compared',
      properties: {
        property_ids: propertyIds,
        comparison_count: propertyIds.length
      }
    });
  }

  // Contact Events
  contactInitiated(propertyId: string, contactMethod: 'whatsapp' | 'phone' | 'email' | 'form', agentId?: string) {
    this.sendEvent({
      event: 'contact_initiated',
      properties: {
        property_id: propertyId,
        contact_method: contactMethod,
        agent_id: agentId
      }
    });
  }

  viewingScheduled(propertyId: string, method: 'whatsapp' | 'form') {
    this.sendEvent({
      event: 'viewing_scheduled',
      properties: {
        property_id: propertyId,
        scheduling_method: method
      }
    });
  }

  // User Journey Events
  savedSearchCreated(searchCriteria: any, alertsEnabled: boolean) {
    this.sendEvent({
      event: 'saved_search_created',
      properties: {
        search_criteria: searchCriteria,
        alerts_enabled: alertsEnabled
      }
    });
  }

  filterUsed(filterType: string, filterValue: any) {
    this.sendEvent({
      event: 'filter_used',
      properties: {
        filter_type: filterType,
        filter_value: filterValue
      }
    });
  }

  calculatorUsed(calculatorType: 'mortgage' | 'transfer_duty' | 'bond', result: any) {
    this.sendEvent({
      event: 'calculator_used',
      properties: {
        calculator_type: calculatorType,
        result
      }
    });
  }

  // Engagement Events
  pageViewed(pageName: string, additionalProps?: Record<string, any>) {
    this.sendEvent({
      event: 'page_viewed',
      properties: {
        page_name: pageName,
        ...additionalProps
      }
    });
  }

  featureUsed(featureName: string, context?: string) {
    this.sendEvent({
      event: 'feature_used',
      properties: {
        feature_name: featureName,
        context
      }
    });
  }

  // User Events
  userRegistered(registrationMethod: string, userType: string) {
    this.sendEvent({
      event: 'user_registered',
      properties: {
        registration_method: registrationMethod,
        user_type: userType
      }
    });
  }

  userLoggedIn(loginMethod: string) {
    this.sendEvent({
      event: 'user_logged_in',
      properties: {
        login_method: loginMethod
      }
    });
  }

  // Error Events
  errorOccurred(errorType: string, errorMessage: string, context?: string) {
    this.sendEvent({
      event: 'error_occurred',
      properties: {
        error_type: errorType,
        error_message: errorMessage,
        context
      }
    });
  }

  // Control methods
  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }
}

export const analytics = new AnalyticsService();
