import { axios } from "../../system";
import { Header } from "semantic-ui-react";

const Error = props => {

    const { data } = props;

    return <div className="text-center px-5 py-3">

        <div style={{ fontSize: "10rem", lineHeight: "10rem", fontFamily: "monospace" }}>{data.status}</div>

        {Boolean(data?.data?.message || data.statusText) && <Header
            as="h4"
            content={data?.data?.message || data.statusText}
            className="text-danger"
        />}

        {!Boolean(data?.data?.message || data.statusText) && <Header
            as="h4"
            content="Неизвестная ошибка"
            className="text-danger"
        />}

    </div>
}

export default Error;