import React from "react";
import { Dimmer, Modal, Loader } from "semantic-ui-react";
import { axios } from "../../system";
import ExpenseFileRow from "./ExpenseFileRow";
import useUpload from "./useUpload";

const ExpenseFiles = props => {

    const { show, setShowFiles } = props;
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [files, setFiles] = React.useState([]);
    const { uploading, FileUploader, uploadProcess } = useUpload({
        cashboxId: show?.id,
        setFilesList: setFiles,
    });

    React.useEffect(() => {

        if (Boolean(show)) {

            setLoading(true);

            axios.post('expenses/files', { id: show?.id })
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

export default ExpenseFiles;