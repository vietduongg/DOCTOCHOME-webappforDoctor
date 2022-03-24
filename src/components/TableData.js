import React, { useState, useEffect } from "react";
import { Table } from "antd";

export default function TableData(columns) {
  const [columnsTable, setColumnsTable] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  async function asyncCall() {
    await fetchDataColumn();
  }
  async function asyncCall2() {
    await fetchDataRow();
  }

  function fetchDataColumn() {
    return new Promise((resolve) => {
      setTimeout(() => {
        setColumnsTable(columns.columns);
      }, 10);
    });
  }

  function fetchDataRow() {
    return new Promise((resolve) => {
      setTimeout(() => {
        setDataTable(columns.dataTableTest);
      }, 10);
    });
  }
  useEffect(() => {
    asyncCall();
    asyncCall2();
  });
  return <Table columns={columnsTable} dataSource={dataTable} />;
}
