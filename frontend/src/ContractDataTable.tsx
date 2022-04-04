import React, {FC} from "react";
// @ts-ignore
import styled from "styled-components";
import Table from "./Table";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`

interface Props {
    tableData: Array<Object>;
}

const ContractDataTable: FC<Props> = ({tableData}): JSX.Element => {
    const columns = React.useMemo(
        () => [
            {
                Header: "Winner address [string]",
                accessor: 'WinningAddress',
            },
            {
                Header: "Winning pool [wei]",
                accessor: "WinningPool"
            },
            {
                Header: "Number of sold lottery tickets [int]",
                accessor: "NumberOfLotteryTicketsBought"
            },
        ],
        []
    );

    return (
        <Styles>
            <Table columns={columns} data={tableData}/>
        </Styles>
    );
}
export default ContractDataTable;
