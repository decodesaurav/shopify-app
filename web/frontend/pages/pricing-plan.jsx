import React, { useState, useEffect } from 'react';
import {useAppQuery, useAuthenticatedFetch} from "../hooks/index.js";

import {
  Card,
  Text,
  Button,
  Icon,
  InlineGrid,
  BlockStack,
  Banner,
  Page,
} from "@shopify/polaris";

import { StatusActiveMajor, CircleCancelMajor } from "@shopify/polaris-icons";

export default function PricingPage() {
	const fetch = useAuthenticatedFetch();

	const [isLoadingReleasePlan, setIsLoadingReleasePlan] = useState(true);
	const [isLoadingEarlyBirdPlan, setIsLoadingEarlyBirdPlan] = useState(true);
	const [hasPayment, setHasPayment] = useState(false);
	const [hasFreePayment, setHasFreePayment] = useState(false);
	const [checkIfSelectedPlan, setSeletedPlanForBanner] = useState(true);
	const showNotification = {content: null}

	useAppQuery({
		url: `/api/check-pricing-status`,
		reactQueryOptions: {
		  onSuccess: (data) => {
			console.log(data);
			if (data.result.hasPayment) {
			  setHasPayment(true);
			  setSeletedPlanForBanner(false)
			}
			if (data.result.hasFreePayment) {
			  	setHasFreePayment(true);
				setSeletedPlanForBanner(false)
			}
			if(data.result.hasNotAcceptedPayment){
				setHasPayment(false);
				setSeletedPlanForBanner(true)
			}
			setIsLoadingReleasePlan(false);
			setIsLoadingEarlyBirdPlan(false);
		  },
		},
	  });
	  const acceptPricingPlan = async (planType) => {
		const res = await fetch("/api/accept-pricing-plan", {
		  method: "POST",
		  body: JSON.stringify({
			planType:planType,
		  }),
		  headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		  },
		});
		return res.json();
	  };

	const SpacingBackground = ({ children, width = "100%" }) => {
		return (
		<div style={{ width, height: "auto", marginBottom: "20px" }}>
			{children}
		</div>
		);
	};
	const handleEarlyBirdPricingPlan = async () => {
		setIsLoadingEarlyBirdPlan(true);
		acceptPricingPlan("earlyBird").then((res) => {
		  if (!res.success) {
			setIsLoadingEarlyBirdPlan(false);
			setSeletedPlanForBanner(true)
		  } else {
			setHasPayment(true)
			setHasFreePayment(false);
			setIsLoadingEarlyBirdPlan(false);
			setSeletedPlanForBanner(false)
		  }
		});
	  };
	
	const handleReleasePlan = async () => {
		setIsLoadingReleasePlan(true);
		acceptPricingPlan("release").then((res) => {
		if (!res.success) {
			setIsLoadingReleasePlan(false);
			setSeletedPlanForBanner(true)
		} else {
			setHasFreePayment(true);
			setHasPayment(false)
			setIsLoadingReleasePlan(false);
			setSeletedPlanForBanner(false)
		}
		});
	};
	// useEffect(() => {
	// 	if (hasFreePayment) {
	// 	  navigate('navigation/dashboard');
	// 	}
	// }, [hasFreePayment, navigate]);

	return (
		<Page title="Subscription Page" full>
			{checkIfSelectedPlan ? (
				<div style={{ padding: '20px 0px 20px 0px' }}>
					<Banner onDismiss={() => setSeletedPlanForBanner(showNotification)}>
					<p>
						Please select a plan to proceed, else you'll be redirected to this page again.
					</p>
					</Banner>
				</div>
			) : (<div> </div>)}

		<SpacingBackground>
			<InlineGrid gap={400} columns={2}>
			<Card>
			<div style={{ padding: "0px 0px 15px 0px"}}>
				<Text variant="heading2xl" as="h3">
				Release Plan
				</Text>
				</div>
				<Text variant="headingLg" as="h5">
				Free
				</Text>
				<BlockStack>
				<div style={{ padding: "15px 0px 0px 0px"}}>
				<Text variant="headingSm" as="h6">
					<div style={{float:"left", paddingRight:"10px"}}>
						<Icon source={StatusActiveMajor} tone="success" />
					</div>
					Upload 10 Discount Batches
				</Text>
				</div>
				</BlockStack>
				<BlockStack>
				<div style={{ padding: "15px 0px 0px 0px"}}>
				<Text variant="headingSm" as="h6">
					<div style={{float:"left", paddingRight:"10px"}}>
						<Icon source={CircleCancelMajor} tone="critical" />
					</div>
					Instant Support
				</Text>
				</div>
				</BlockStack>
				<BlockStack>
				<div style={{ padding: "15px 0px"}}>
				<Text variant="headingSm" as="h6">
					<div style={{float:"left", paddingRight:"10px"}}>
						<Icon source={CircleCancelMajor} tone="critical" />
					</div>
					Unlimited Upload
				</Text>
				</div>
				</BlockStack>
				<div style={{ marginTop: "auto" }}>
					<Button 
						variant="primary"
						size="large"
						onClick={handleReleasePlan}
						loading={isLoadingReleasePlan}
						disabled={hasFreePayment}
						fullWidth
					>{!hasFreePayment ? "Select Plan" : "Current Plan" }
					</Button>
				</div>
			</Card>
			<Card>
				<div style={{ display: 'flex', flexDirection: 'column', height: '80%' }}>
					<div style={{ flex: 1 }}>
					<Text variant="heading2xl" as="h3">
						Early Bird
					</Text>
					<Text as="p" textDecorationLine="line-through">
						$3.99/month
					</Text>
					<Text variant="headingLg" as="h5">
						$1.99/month
					</Text>
					<BlockStack>
						<div style={{ padding: "15px 0px 0px 0px" }}>
						<Text variant="headingSm" as="h6">
							<div style={{ float: "left", paddingRight: "10px" }}>
							<Icon source={StatusActiveMajor} tone="success" />
							</div>
							Upload Unlimited Discount Batches
						</Text>
						</div>
					</BlockStack>
					<BlockStack gap={500}>
						<div style={{ padding: "15px 0px" }}>
						<Text variant="headingSm" as="h6">
							<div style={{ float: "left", paddingRight: "10px" }}>
							<Icon source={StatusActiveMajor} tone="success" />
							</div>
							Email Support and Customer Service
						</Text>
						</div>
					</BlockStack>
					</div>
				</div>
					<div style={{ marginTop: "28px" }}>
					<Button 
						size="large"
						tone="success"
						variant="primary"
						onClick={handleEarlyBirdPricingPlan}
						loading={isLoadingEarlyBirdPlan}
						disabled={hasPayment}
						fullWidth
					>
						{!hasPayment ? "Select Plan" : "Current Plan" }
					</Button>
				</div>
				</Card>
			</InlineGrid>
		</SpacingBackground>
		</Page>
	);
}