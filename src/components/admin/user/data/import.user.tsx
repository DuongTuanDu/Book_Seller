import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, Upload, UploadProps } from "antd"
import ExcelJS from "exceljs";
import { Buffer } from "buffer";
import { useState } from "react";
import { bulkCreateUserAPI } from "@/services/api";
import templateFile from "assets/template/user.xlsx?url";

const { Dragger } = Upload;
interface IProps {
    openModalImport: boolean
    setOpenModalImport: (v: boolean) => void
    refreshTable: () => void
}

interface IDataImport {
    fullName: string;
    email: string;
    phone: string;
}

const ImportUser = (props: IProps) => {
    const { message, notification } = App.useApp();
    const { openModalImport, setOpenModalImport, refreshTable } = props;
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        customRequest: ({ file, onSuccess }) => {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000)
        },
        onChange: async (info) => {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                console.log("info", info);
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    //load file to buffer
                    const workbook = new ExcelJS.Workbook();
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);

                    //convert file to json
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        const firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;

                        const keys = firstRow.values as any[];

                        sheet.eachRow(function (row, rowNumber) {
                            if (rowNumber === 1) return;
                            const values = row.values as any[];
                            const obj: any = {};
                            for (let i = 0; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })
                    })
                    jsonData = jsonData.map((item, index) => ({ ...item, id: index + 1 }))
                    setDataImport(jsonData);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    }

    const handleImport = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }))
        const res = await bulkCreateUserAPI(dataSubmit);
        if (res.data) {
            notification.success({
                message: "Bulk Create User",
                description: `Success = ${res.data.countSuccess}, Error = ${res.data.countError}`
            })
        }
        setIsSubmit(false);
        setOpenModalImport(false);
        setDataImport([]);
        refreshTable();
    }

    return (
        <Modal
            title="Import data user"
            open={openModalImport}
            width={"50vw"}
            onOk={() => { handleImport() }}
            onCancel={() => setOpenModalImport(false)}
            okText="Import data"
            okButtonProps={{ disabled: dataImport.length > 0 ? false : true, loading: isSubmit }}
            maskClosable={false}
            destroyOnClose={true}
        >
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single upload. Only accept .csv, .xls, .xlsx . or
                    &nbsp;
                    <a
                        onClick={e => e.stopPropagation()}
                        href={templateFile}
                        download
                    >
                        Download Sample File
                    </a>
                </p>
            </Dragger>
            <div style={{ paddingTop: 20 }}>
                <Table
                    rowKey={"id"}
                    title={() => <span>Dữ liệu Upload:</span>}
                    dataSource={dataImport}
                    columns={[
                        { dataIndex: 'fullName', title: 'Họ và tên' },
                        { dataIndex: 'email', title: 'Email' },
                        { dataIndex: 'phone', title: 'Số điện thoại' },
                    ]}
                />
            </div>
        </Modal>
    )
}

export default ImportUser