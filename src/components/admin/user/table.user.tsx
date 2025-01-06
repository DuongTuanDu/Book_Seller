import { getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Space, Tag, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import DetailUser from './detail.user';
import CreateUser from './create.user';
import ImportUser from './data/import.user';
import { CSVLink } from 'react-csv';

interface TSearch {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);

    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);

    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            render: (_, __, index) => {
                return (meta.current - 1) * meta.pageSize + index + 1;
            },
        },
        {
            title: '_id',
            dataIndex: '_id',
            hideInSearch: true,
            render: (dom, entity, index, action, schema) => {
                return (
                    <Link to="#"
                        onClick={() => {
                            setDataViewDetail(entity)
                            setOpenViewDetail(true)
                        }}
                    >
                        {entity._id}
                    </Link>
                )
            }
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true
        },
        {
            title: 'Action',
            hideInSearch: true,
            render: (dom, entity, index, schema) => {
                return (
                    <>
                        <Tooltip
                            title="Edit"
                            placement="top"
                        >
                            <EditTwoTone twoToneColor={'#f57800'} style={{ cursor: 'pointer', marginRight: 15 }} />
                        </Tooltip>
                        <Tooltip
                            title="Delete"
                            placement="top"
                        >
                            <DeleteTwoTone twoToneColor={'#ff4d4f'} style={{ cursor: 'pointer' }} />
                        </Tooltip>
                    </>
                )
            }
        }
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                    }
                    if (params.email) {
                        query += `&email=/${params.email}/i`
                    }
                    if (params.fullName) {
                        query += `&fullName=/${params.fullName}/i`
                    }
                    const createDateRange = dateRangeValidate(params.createdAtRange);
                    if (createDateRange) {
                        query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                    }

                    query += `&sort=-createdAt`

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    } else {
                        query += `&sort=-createdAt`
                    }

                    const res = await getUsersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta)
                        setCurrentDataTable(res.data?.result ?? [])
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} out of {total} rows</div>) }
                }}
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                    >
                        <CSVLink
                            data={currentDataTable}
                            filename="export-user.csv"
                        >
                            Export
                        </CSVLink>
                    </Button>,
                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                        onClick={() => setOpenModalImport(true)}
                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenCreateModal(true)
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
            />
            <DetailUser
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <CreateUser
                openModalCreate={openCreateModal}
                setOpenModalCreate={setOpenCreateModal}
                refreshTable={refreshTable}
            />
            <ImportUser
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableUser;