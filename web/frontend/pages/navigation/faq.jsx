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
        'We have different fields on our "Create Discount" page. You need to fill all the necessary fields (Batch Name, Discount to Map in shopify, and number of codes to generate). Only after entering required fields "Create discount" button is enabled. After creating the discount batch, discount codes are posted on the selected Shopify Discount.',
    },
    {
      id: 2,
      question: 'What are the required fields?',
      answer:
        'You need to enter the name of the discount batch, and after that, you are required to select the Shopify Discount to which you\'re going to post the discount codes. You can choose the number of codes you want to generate, and also, you can choose what type of code you want as well.',
    },
	{
		id: 3,
		question: 'What is Advanced Code Pattern?',
		answer:
			'Advanced Code pattern is advanced feature provided to meet the custom requirement of code. First, You should check the Advanced Code Pattern at the Bottom of "Create Discount" Page. And in the pattern field, you need to enter the pattern in either of [N],[LN],[L] format where L is letter and N is number and LN is combination of number and letter.',
	},
	{
		id: 4,
		question: 'How do I use Advanced Code Pattern?',
		answer:
			'For example you  want to enter code like "hello182" then you can type hello[3N] in Pattern field. Also you want 112-wow-50%off then you can type [3N]-[3L]-50%off. And if you want combination of letters and number, you can use [3NL]"your-code."',
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
                    <strong>{faq.question}</strong>
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
