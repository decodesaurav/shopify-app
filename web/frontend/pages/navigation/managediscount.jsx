import {
	Spinner,
	IndexTable,
	LegacyCard,
	IndexFilters,
	useSetIndexFiltersMode,
	Text,
	Badge,
	useBreakpoints,
	Page,
	Pagination,
	Layout,
	SkeletonBodyText
  } from '@shopify/polaris';
import {useState, useCallback, useEffect} from 'react';
import _debounce from 'lodash/debounce';
import { useApiCall } from '../../hooks/apiUtils';

  
export default function IndexTableWithViewsSearchFilterSorting() {
	const [loading, setLoading] = useState(true);
	const [totalCount, setTotalCount] = useState(0);
	const [itemStrings, setItemStrings] = useState([
	  'All',
	  'Failed'
	]);
  
	const [selected, setSelected] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const makeApiCall = useApiCall();
	const tabs= itemStrings.map((item, index) => ({
	  content: item,
	  index,
	  id: `${item}-${index}`,
	  isLocked: index === 0,
	}));

	const [orders, setOrders] = useState([]);

	const sortOptions = [
		{label: 'Date', value: 'date desc', directionLabel: 'latest'},
		{label: 'Date', value: 'date asc', directionLabel: 'early'},
	];

	const [sortSelected, setSortSelected] = useState(['date desc']);
	const [queryValue, setQueryValue] = useState('');
	const {mode, setMode} = useSetIndexFiltersMode();
	const handleQueryCancel = () => {
		setQueryValue('');
		fetchData(currentPage);
	};
	const onHandleCancel = () => {};

	const handleFiltersQueryChange = useCallback(
		_debounce((value) => {
		  setQueryValue(value);
		  setCurrentPage(1);
		  debounceFetchData(value, 1);
		}, 100),
		[]
	);

	const handleSortChange = (sortOption) => {
		setSortSelected(sortOption);
	};

	const filters = [];

	const appliedFilters = [];

	const resourceName = {
		singular: 'discount batch',
		plural: 'discount batches',
	};
	const debounceFetchData = _debounce(
		async (value, page) => {
		  try {
			const endpoint =
			  selected === 0
				? `/api/get-all-discounts?search=${value}&sort=${sortSelected}&page=${page}`
				: `/api/get-failed-discounts?search=${value}&sort=${sortSelected}&page=${page}`;
			const { data, error, count } = await makeApiCall(endpoint, 'get');
			if (error) {
			  console.error('Error: ', error);
			} else {
			  setOrders(data);
			  setTotalCount(count);
			}
		  } finally {
			setLoading(false);
		  }
		},
		1000,
	);

	const fetchData = async (page) => {
		try {
		const endpoint =
			selected === 0
			? `/api/get-all-discounts?sort=${sortSelected}&page=${page}`
			: `/api/get-failed-discounts?sort=${sortSelected}&page=${page}`;
		const { data, error, count } = await makeApiCall(endpoint, 'get');
		if (error) {
			console.error('Error: ', error);
		} else {
			setOrders(data);
			setTotalCount(count);
		}
		} finally {
			setLoading(false);
		}
	};

	const handleNextPage = () => {
		const nextPage = currentPage + 1;
		console.log(nextPage)
		setCurrentPage(nextPage);
		fetchData(nextPage);
	};
	const handlePreviousPage = () => {
		const previousPage = currentPage - 1;
		console.log(previousPage)
		setCurrentPage(previousPage);
		fetchData(previousPage);
	};

	useEffect(() => {
		fetchData(currentPage);
	}, [selected, sortSelected, currentPage]);
  
	const rowMarkup = orders.map(
	  (
		{id, numberOfDiscount, shopifyDiscountTitle, codePrefix, codeSuffix, remarks},
		index,
	  ) => (
		<IndexTable.Row
				id={id}
				key={id}
				position={index}
			>
		  <IndexTable.Cell>#{id}</IndexTable.Cell>
		  <IndexTable.Cell>
			<Text variant="bodyMd" fontWeight="bold">
			  {numberOfDiscount}
			</Text>
		  </IndexTable.Cell>
		  <IndexTable.Cell>{shopifyDiscountTitle}</IndexTable.Cell>
		  <IndexTable.Cell>{codePrefix}</IndexTable.Cell>
		  <IndexTable.Cell>{codeSuffix}</IndexTable.Cell>
		  <IndexTable.Cell>
				{remarks === 0 ? (
					<Badge progress="incomplete" tone="critical">
					Failed
					</Badge>
				) : (
					<Badge progress="complete" tone="attention">
					Published
					</Badge>
				)}
			</IndexTable.Cell>
		</IndexTable.Row>
	  ),
	);
  
	return (
		<>
		{!loading ? (
		<Page title="Discount Batches">
			<Layout.Section>
			<LegacyCard>
				<IndexFilters
				sortOptions={sortOptions}
				sortSelected={sortSelected}
				queryValue={queryValue}
				queryPlaceholder="Searching in Shopify Discount"
				onQueryChange={handleFiltersQueryChange}
				onSortChange={handleSortChange}
				onQueryClear={handleQueryCancel}
				onSort={setSortSelected}
				cancelAction={{
					onAction: onHandleCancel,
					disabled: false,
					loading: false,
				}}
				tabs={tabs}
				selected={selected}
				onSelect={setSelected}
				canCreateNewView={false}
				filters={filters}
				appliedFilters={appliedFilters}
				mode={mode}
				setMode={setMode}
				/>
				<IndexTable
				resourceName={resourceName}
				itemCount={orders.length}
				headings={[
					{ title: 'Discount Batch' },
					{ title: 'Number of Discount' },
					{ title: 'Shopify Discount' },
					{ title: 'Code Prefix' },
					{ title: 'Code Suffix' },
					{ title: 'Remarks' },
				]}
				selectable={false}
				>
				{loading ? (
					<IndexTable.Row>
					<IndexTable.Cell>
						<Spinner accessibilityLabel="Loading" size="large" />
					</IndexTable.Cell>
					</IndexTable.Row>
				) :
					rowMarkup
				}
				</IndexTable>
			</LegacyCard>
			<div style={{ display: 'flex', margin: '10px', justifyContent: 'end' }}>
				<Pagination
				hasPrevious={currentPage > 1}
				onPrevious={handlePreviousPage}
				hasNext={currentPage * 15 < totalCount}
				onNext={handleNextPage}
				label={`${(currentPage - 1) * 15 + 1}-${currentPage * 15} of ${totalCount} Batches`}
				/>
			</div>
			</Layout.Section>
		</Page>
		) : (
		<SkeletonBodyText>
			{/* Your skeleton or loading state content */}
		</SkeletonBodyText>
		)}
	</>
);
};
