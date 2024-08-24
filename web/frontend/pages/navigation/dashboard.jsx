import React, { useEffect, useState } from 'react';
import { AppProvider, Page, Grid, LegacyCard, Card, Text, Layout, Spinner } from '@shopify/polaris';
import { useApiCall } from '../../hooks/apiUtils';
import {useNavigate} from 'react-router-dom';

export default function Dashboard() {
	const [discounts, setDashboardData ] = useState([]);
	const makeApiCall = useApiCall();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const handleGenerateDiscountCodes = async () => {
			setLoading(true)
			const endpoint = '/api/get-dashboard-data';
			const { data, error, count, redirectToPricing } = await makeApiCall(endpoint, 'get');
			if(redirectToPricing){
				return navigate('/pricing-plan');
			}
			if (error) {
				console.log('Error: ', error);
			} 
			if(data){
				setLoading(false)
				setDashboardData(data.data);
			} else {
				setLoading(false)
			}
		};
		handleGenerateDiscountCodes();
	}, []);

  return (
    <AppProvider>
      <Page title="Dashboard">
        <Layout>
          <Layout.Section>
			<div style={{ padding: '20px 0px 20px 0px' }}>
				<Card>
					<div style={{ padding: '20px 20px 20px 20px' }}>
						Welcome to Discount Code. You can upload the discount codes to any price rules in Shopify.
					</div>
				</Card>
			</div>
          </Layout.Section>
        </Layout>
		<div style={{ padding: '20px 0px 20px 0px' }}>
			<Text variant="heading2xl" as="h3">
				Discount Overview
			</Text>
		</div>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <LegacyCard title="Discounts Uploaded" sectioned>
              <p>{loading ? (
					<Spinner size="small" color="teal" />
					) :( discounts.discountUploadedSuccessfully ? discounts.discountUploadedSuccessfully : 0 )}</p>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <LegacyCard title="Discount Failed" sectioned>
              <p>{loading ? (
					<Spinner size="small" color="teal" />
					) : discounts.countDiscountFailed ? discounts.countDiscountFailed : 0 }</p>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <LegacyCard title="Upload Remaining" sectioned>
              <p>{loading ? (
					<Spinner size="small" color="teal" />
					) : (isNaN(discounts.uploadLimit) ? "Unlimited" : (discounts.uploadLimit - discounts.discountUploadedSuccessfully))}</p>
            </LegacyCard>
          </Grid.Cell>
        </Grid>
		<div style={{ padding: '20px 0px 20px 0px' ,marginTop: '20px' }}>
			<Text variant="heading2xl" as="h3">
				Subscription Overview
			</Text>
		</div>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <LegacyCard title="Current Plan" sectioned>
              <p>{loading ? (
					<Spinner size="small" color="teal" />
					) : discounts.currentPlan}</p>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <LegacyCard title="Discount Upload Limit" sectioned>
              <p>{loading ? (
					<Spinner size="small" color="teal" />
					) : discounts.uploadLimit ? discounts.uploadLimit : "Unlimited"}</p>
            </LegacyCard>
          </Grid.Cell>
        </Grid>
      </Page>
    </AppProvider>
  );
}
