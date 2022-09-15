import React from "react";
import { Icon } from "semantic-ui-react";
import Spinner from "../UI/Spinner";
import DownloadLink from "react-download-link";
import Cookies from "js-cookie";
import { axios } from "../../system";

const UploadProcess = ({ percent }) => <div>

    <div className="file-upload-progress">
        <div className="file-upload-progress-bar" style={{ width: `${percent || 0}%`, opacity: Number(percent) >= 100 ? "0.3" : "1" }} />
    </div>

    {Number(percent) >= 100 && <div className="d-flex align-items-center justify-content-center">
        <Spinner size="mini" />
    </div>}

</div>

const etensionsToName = {
    pdf: "file pdf",
    zip: "file archive",
    jpg: "file image",
    jpeg: "file image",
    png: "file image",
    gif: "file image",
    ico: "file image",
    bmp: "file image",
    mp3: "file audio",
    wav: "file audio",
    ogg: "file audio",
    avi: "file video",
    mp4: "file video",
    h264: "file video",
    h265: "file video",
    mkv: "file video",
    js: "file code",
    json: "file code",
    php: "file code",
    css: "file code",
    xml: "file code",
    html: "file code",
    csv: "file excel",
    xls: "file excel",
    xlsx: "file excel",
    doc: "file word",
    docx: "file word",
    rtf: "file word",
    txt: "file text",
}

const FileIcon = ({ extension }) => {

    return <Icon
        name={etensionsToName[extension] || "file"}
        title={extension}
        className="file-type-icon"
    />
}

const getDataFromURL = (url) => new Promise((resolve, reject) => {
    setTimeout(() => {

        let tokenKey = process.env.REACT_APP_TOKEN_KEY || "crm_ard_token";
        const token = Cookies.get(tokenKey) || localStorage.getItem(tokenKey);

        fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => response.blob())
            .then(data => {
                resolve(data)
            });
    });
}, 300);

const ExpenseFileRow = props => {

    const { row, uploadProcess, setRename, setDropFile, setFiles, income } = props;
    const className = ["d-flex align-items-center"];

    const [reestablish, setReestablish] = React.useState(false);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {

        const handleReestablish = () => axios.post('files/reestablish', { id: row.id, income })
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
            })
            .catch(e => setError(axios.getError(e)))
            .then(() => setReestablish(false));

        if (reestablish) handleReestablish();

    }, [reestablish]);

    if (Boolean(row.error)) className.push("file-error");
    if (row.deleted_at) className.push("file-deleted");

    return <div className={className.join(" ")}>

        <span>
            <FileIcon extension={row.extension} />
        </span>

        <div className="flex-grow-1 file-name">
            <DownloadLink
                label={row.name}
                filename={row.name}
                exportFile={() => Promise.resolve(getDataFromURL(row.url))}
                style={{}}
                className="download-file-name"
            />
        </div>

        <div className="position-relative">

            {row.is_upload && !Boolean(row.error) && <div>
                <UploadProcess percent={Boolean(uploadProcess[row.id]) ? uploadProcess[row.id] : 0} />
            </div>}

            {row.error && <Icon
                name="warning sign"
                color="red"
                title={`Ошибка: ${row.error}`}
            />}

            {!row.is_upload && !row.error && <div className="d-flex align-items-center">

                {!row.deleted_at && <>
                    <span>
                        <DownloadLink
                            label={<Icon
                                name="download"
                                link
                                title="Скачать"
                            />}
                            filename={row.name}
                            exportFile={() => Promise.resolve(getDataFromURL(row.url))}
                            style={{
                                color: null,
                                marginRight: "0.5rem",
                            }}
                        />
                    </span>
                    <span>
                        <Icon
                            name="pencil"
                            link
                            title="Переименовать"
                            onClick={() => setRename(row)}
                        />
                    </span>
                    <span>
                        <Icon
                            name="trash"
                            link
                            color="red"
                            title="Удалить"
                            onClick={() => setDropFile(row)}
                        />
                    </span>
                </>}

                {row.deleted_at && <>
                    {error && <span>
                        <Icon
                            name="warning sign"
                            color="red"
                            title={`Ошибка ${error}`}
                        />
                    </span>}
                    <span className="position-relative">
                        <Icon
                            name="redo"
                            link={!reestablish}
                            disabled={reestablish}
                            color="orange"
                            title="Восстановить"
                            onClick={() => setReestablish(row)}
                        />

                        {reestablish && <span className="position-absolute-all"><Spinner size="mini" /></span>}

                    </span>
                </>}

            </div>}

        </div>

    </div>
}

export default ExpenseFileRow;