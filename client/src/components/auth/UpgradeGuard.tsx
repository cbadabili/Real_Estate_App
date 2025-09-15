
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RegistrationModal } from './RegistrationModal';

interface UpgradeGuardProps {
  children: React.ReactElement;
  requiredPlan?: string;
  requiredFeature?: string;
  action: string;
  upgradeMessage?: string;
}

export const UpgradeGuard: React.FC<UpgradeGuardProps> = ({
  children,
  requiredPlan,
  requiredFeature,
  action,
  upgradeMessage
}) => {
  const { user, subscription, entitlements } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [plans, setPlans] = useState([]);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/billing/plans');
      const data = await response.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const checkAccess = () => {
    // If no user, show registration modal
    if (!user) {
      fetchPlans();
      setShowModal(true);
      return false;
    }

    // If feature is specified, check entitlements
    if (requiredFeature && entitlements) {
      const entitlement = entitlements[requiredFeature];
      if (!entitlement || entitlement.remaining <= 0) {
        // Show upgrade prompt
        alert(upgradeMessage || `Upgrade your plan to access this feature.`);
        return false;
      }
    }

    // If plan is specified, check subscription
    if (requiredPlan && subscription?.plan?.code !== requiredPlan) {
      alert(upgradeMessage || `This feature requires the ${requiredPlan} plan.`);
      return false;
    }

    return true;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (checkAccess()) {
      // Allow the original action
      if (children.props.onClick) {
        children.props.onClick(e);
      }
    }
  };

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleClick
      })}
      
      <RegistrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        triggerAction={action}
        plans={plans}
      />
    </>
  );
};
