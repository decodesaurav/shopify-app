import React, { useEffect, useState } from 'react';
import { AppProvider, Page, Grid, LegacyCard, Card, Text, Layout, Icon } from '@shopify/polaris';
import { useApiCall } from '../../hooks/apiUtils';
import {useNavigate} from 'react-router-dom';

export default function Dashboard() {
	const [discounts, setDashboardData ] = useState([]);
	const makeApiCall = useApiCall();
	const navigate = useNavigate();

	useEffect(() => {
		const handleGenerateDiscountCodes = async () => {
			const endpoint = '/api/get-dashboard-data';
			const { data, error, count, redirectToPricing } = await makeApiCall(endpoint, 'get');
			if(redirectToPricing){
				return navigate('/pricing-plan');
			}
			if (error) {
				console.log('Error: ', error);
			} else {
				setDashboardData(data.data);
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
              <p>{discounts.discountUploadedSuccessfully}</p>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <LegacyCard title="Discount Failed" sectioned>
              <p>{discounts.countDiscountFailed}</p>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <LegacyCard title="Upload Remaining" sectioned>
              <p>{discounts.uploadLimit}</p>
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
              <p>{discounts.currentPlan}</p>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <LegacyCard title="Discount Upload Limit" sectioned>
              <p>{discounts.uploadLimit}</p>
            </LegacyCard>
          </Grid.Cell>
        </Grid>
      </Page>
    </AppProvider>
  );
}
