import React from "react";
import { Dimmer, Modal, Loader } from "semantic-ui-react";
import { axios } from "../../system";

const ExpenseFiles = props => {

    const { show, setShowFiles } = props;
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [files, setFiles] = React.useState([]);

    React.useEffect(() => {

        if (Boolean(show)) {

            setLoading(true);

            axios.post('expenses/files', { id: show?.id })
                .then(({ data }) => {

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
        closeIcon={{ name: "close", onClick: () => setShowFiles(false) }}
        content={{
            content: <div className="position-relative" style={{ minHeight: "5rem" }}>

                {!loading && error && <div className="position-absolute-all d-flex align-items-center justify-content-center py-4">
                    <div className="text-danger text-center"><strong>{error}</strong></div>
                </div>}

                <Dimmer active={loading} inverted>
                    <Loader />
                </Dimmer>

            </div>
        }}
    />
}

export default ExpenseFiles;