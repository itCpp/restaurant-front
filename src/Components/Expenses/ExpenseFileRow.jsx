import { Icon } from "semantic-ui-react";
import Spinner from "../UI/Spinner";

const UploadProcess = ({ percent }) => {
    return <div>

        <div className="file-upload-progress">
            <div className="file-upload-progress-bar" style={{ width: `${percent || 0}%`, opacity: Number(percent) >= 100 ? "0.3" : "1" }} />
        </div>

        {Number(percent) >= 100 && <div className="d-flex align-items-center justify-content-center">
            <Spinner size="mini" />
        </div>}
    </div>
}

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
    />
}

const ExpenseFileRow = props => {

    const { row, uploadProcess } = props;
    const className = ["d-flex align-items-center"];

    if (Boolean(row.error)) className.push("file-error");

    return <div className={className.join(" ")}>

        <span>
            <FileIcon extension={row.extension} />
        </span>

        <div className="flex-grow-1">
            {row.name}
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

        </div>

    </div>
}

export default ExpenseFileRow;