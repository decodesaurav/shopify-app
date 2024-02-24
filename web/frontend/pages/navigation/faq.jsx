import React, { useState } from 'react';
import {
  Page,
  Layout,
  LegacyCard,
  LegacyStack,
  Button,
  Collapsible,
  TextContainer,
} from '@shopify/polaris';

const FAQPage = () => {
  const [expanded, setExpanded] = useState({});

  const handleToggle = (id) => {
    setExpanded((prevExpanded) => ({
      [id]: !prevExpanded[id],
    }));
  };

  const faqData = [
    {
      id: 1,
      question: 'How does the App Work?',
      answer:
        'We have different fields on our "Create Discount" page. You need to fill all the necessary fields, and then the create discount field is enabled. After creating the discount batch, discount codes are posted on the selected Shopify Discount.',
    },
    {
      id: 2,
      question: 'What are the required fields?',
      answer:
        'You need to enter the name of the discount batch, and after that, you are required to select the Shopify Discount to which you\'re going to post the discount codes. You can choose the number of codes you want to generate, and also, you can choose what type of code you want as well.',
    },
    // Add FAQ here, will make separate dashboard for CRUD operation
  ];

  return (
    <Page title="FAQ">
      <Layout>
        {faqData.map((faq) => (
          <Layout.Section key={faq.id}>
            <div onClick={() => handleToggle(faq.id)} style={{ cursor: 'pointer' }}>
              <LegacyCard sectioned>
                <LegacyStack vertical>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Button
                      plain
                      ariaExpanded={expanded[faq.id]}
                      monochrome={true}
                      removeUnderline={true}
                      textAlign="left"
                    >
                    <strong>{faq.question}</strong>
                    </Button>
                    <div style={{ marginLeft: 'auto' }}>
                      <Button
                        plain
                        disclosure={expanded[faq.id] ? 'up' : 'down'}
                        ariaExpanded={expanded[faq.id]}
                        monochrome={true}
                        removeUnderline={true}
                      />
                    </div>
                  </div>
                  <Collapsible
                    open={expanded[faq.id]}
                    id={`basic-collapsible-${faq.id}`}
                    transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                    expandOnPrint
                  >
                    <TextContainer>
                      <p>{faq.answer}</p>
                    </TextContainer>
                  </Collapsible>
                </LegacyStack>
              </LegacyCard>
            </div>
          </Layout.Section>
        ))}
      </Layout>
    </Page>
  );
};

export default FAQPage;
