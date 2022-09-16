import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, Message } from "semantic-ui-react";
import { axios } from "../../system";

const Tenant = () => {

    const { id } = useParams();
    const [loading, setLoadgin] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        axios.post('tenant/get', { id: Number(id) })
            .then(() => { })
            .catch(e => setError(axios.getError(e)))
            .then(() => setLoadgin(false));

        return () => {
            setLoadgin(true);
        }

    }, []);

    return <div>

        {loading && <Loader active inline="centered" className="mt-3" />}

        {!loading && <>
        
            {error && <Message
                content={error}
                className="mt-3 mx-auto"
                size="mini"
                error
                style={{ maxWidth: 500 }}
            />}
        
        </>}

    </div>
}

export default Tenant;