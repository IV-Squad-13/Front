import Table from '@/components/table/Table';

const TableStep = ({ columns, data, setData }) => {
  return <Table columns={columns} data={data} setData={setData} />;
};

export default TableStep;
