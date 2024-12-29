import { getUsersAPI } from '@/services/api';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Space, Tag, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const columns: ProColumns<IUserTable>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: '_id',
        dataIndex: '_id',
        hideInSearch: true,
        render: (dom, entity, index, schema) => {
            return (
                <Link to="#">{entity._id}</Link>
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

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    return (
        <>
            <ProTable<IUserTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(sort, filter);
                    const res = await getUsersAPI()
                    if (res.data) {
                        setMeta(res.data.meta)
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
                    showTotal: (total, range) => {return (<div>{range[0]}-{range[1]} out of {total} rows</div>)}
                }}
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
            />
        </>
    );
};

export default TableUser;