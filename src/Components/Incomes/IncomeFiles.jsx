import React from "react";
import { Dimmer, Modal, Loader, Header, Input, Button } from "semantic-ui-react";
import { axios } from "../../system";
import ExpenseFileRow from "../Expenses/ExpenseFileRow";
import useUpload from "../Expenses/useUpload";

const IncomeFiles = props => {

    const { show, setShowFiles } = props;
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [files, setFiles] = React.useState([]);

    console.log(show);

    const { uploading, FileUploader, uploadProcess } = useUpload({
        incomeId: show?.id,
        setFilesList: setFiles,
        url: "incomes/file/upload",
    });

    const [rename, setRename] = React.useState(false);
    const [dropFile, setDropFile] = React.useState(false);

    React.useEffect(() => {

        if (Boolean(show)) {

            setLoading(true);

            axios.post('incomes/files', { id: show?.id })
                .then(({ data }) => {
                    setFiles(data.files);
                })
                .catch(e => {
                    setError(axios.getError(e));
                })
                .then(() => {
                    setLoading(false);
                });
        }

        return () => {
            setLoading(true);
            setError(null);
            setFiles([]);
        }

    }, [show]);

    return <Modal
        open={Boolean(show)}
        header={`Файлы ${show?.name_type || show?.name}`}
        centered={false}
        closeIcon={uploading ? null : { name: "close", onClick: () => setShowFiles(false) }}
        content={{
            scrolling: true,
            content: <div className="position-relative" style={{ minHeight: "5rem" }}>

                <FileRename
                    data={rename}
                    close={() => setRename(false)}
                    setFiles={setFiles}
                />

                <FileDrop
                    data={dropFile}
                    close={() => setDropFile(false)}
                    setFiles={setFiles}
                />

                {!loading && error && <div className="position-absolute-all d-flex align-items-center justify-content-center py-4">
                    <div className="text-danger text-center"><strong>{error}</strong></div>
                </div>}

                {!loading && !error && <>

                    <div className="position-relative">
                        <FileUploader />
                        <Dimmer active={uploading} inverted><Loader /></Dimmer>
                    </div>

                    {files.length === 0 && <div className="text-center mt-4">
                        <div className="opacity-40">Файлов еще нет</div>
                    </div>}

                    {files.length > 0 && <div className="mt-4">

                        <div className="file-list">
                            {files.map(row => <ExpenseFileRow
                                key={row.id}
                                row={row}
                                uploadProcess={uploadProcess}
                                setRename={setRename}
                                setDropFile={setDropFile}
                                setFiles={setFiles}
                            />)}
                        </div>

                    </div>}

                </>}

                <Dimmer active={loading} inverted>
                    <Loader />
                </Dimmer>

            </div>
        }}
    />
}

export const FileRename = props => {

    const { data, close, setFiles } = props;
    const [name, setName] = React.useState("");
    const [rename, setRename] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        setError(null);
        setName(data?.name || "")
    }, [data]);

    React.useEffect(() => {

        if (rename) {
            axios.post('files/rename', { id: data?.id, name, income: true })
                .then(({ data }) => {
                    setFiles(p => {
                        let files = [...p];
                        files.forEach((row, i) => {
                            if (row.id === data.id) {
                                files[i] = data;
                            }
                        });
                        return files;
                    });
                    close();
                })
                .catch(e => setError(axios.getError(e)))
                .then(() => setRename(false));
        }

    }, [rename]);

    return <Modal
        open={Boolean(props.data)}
        size="mini"
        centered={false}
        onClose={() => rename ? null : close()}
        content={<div className="p-3">

            <Header
                as="h5"
                content="Переименовать"
            />

            <Input
                fluid
                value={name}
                onChange={(e, { value }) => setName(value)}
                className="mb-3"
                disabled={rename}
                onKeyUp={e => e.keyCode === 13 ? setRename(true) : null}
            />

            {error && <div className="text-danger mb-3" style={{ opacity: rename ? ".4" : "1" }}>
                <strong>Ошибка</strong>{' '}
                <span>{error}</span>
            </div>}

            <div className="text-center">

                <Button
                    content="Отмена"
                    onClick={() => rename ? null : close()}
                    disabled={rename}
                />

                <Button
                    content="Переименовать"
                    color="green"
                    onClick={() => setRename(true)}
                    disabled={rename}
                    loading={rename}
                />

            </div>

        </div>}
    />
}

export const FileDrop = props => {

    const { data, close, setFiles } = props;
    const [drop, setDrop] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        setError(null);
    }, [data]);

    React.useEffect(() => {

        if (drop) {
            axios.delete('files/drop', { params: { id: data?.id, income: true } })
                .then(({ data }) => {
                    setFiles(p => {
                        let files = [...p];
                        files.forEach((row, i) => {
                            if (row.id === data.id) {
                                files[i] = data;
                            }
                        });
                        return files;
                    });
                    close();
                })
                .catch(e => setError(axios.getError(e)))
                .then(() => setDrop(false));
        }

    }, [drop]);

    return <Modal
        open={Boolean(props.data)}
        size="mini"
        centered={false}
        onClose={() => drop ? null : close()}
        content={<div className="p-3">

            <Header
                as="h5"
                icon={{ name: "trash", color: "red" }}
                content="Удаление"
            />

            <div>Вы действительно желаете удалить файл{data?.name ? <code className="ms-2"><b>{data.name}</b></code> : null}?</div>

            {error && <div className="text-danger mt-3" style={{ opacity: drop ? ".4" : "1" }}>
                <strong>Ошибка</strong>{' '}
                <span>{error}</span>
            </div>}

            <div className="text-center mt-4">

                <Button
                    content="Нет"
                    onClick={() => drop ? null : close()}
                    disabled={drop}
                    color="green"
                    className="mx-2"
                />

                <Button
                    content="Да"
                    color="red"
                    onClick={() => setDrop(true)}
                    disabled={drop}
                    loading={drop}
                    icon="check"
                    labelPosition="right"
                    className="mx-2"
                />

            </div>

        </div>}
    />
}

export default IncomeFiles;