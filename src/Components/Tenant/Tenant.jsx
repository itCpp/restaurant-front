import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, GridRow, Header, Label, Loader, Message } from "semantic-ui-react";
import Segment from "../UI/Segment";
import { axios } from "../../system";
import TenantData from "./TenantData";
import TenantPays from "./TenantPays";

const Tenant = () => {

    const { id } = useParams();
    const [loading, setLoadgin] = useState(true);
    const [error, setError] = useState(null);
    const [row, setRow] = useState({});

    useEffect(() => {

        axios.post('tenant/get', { id: Number(id) })
            .then(({ data }) => {
                setRow({ ...data.row, pays: data.pays });
            })
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

            {!error && <div className="p-2 pt-4">

                <Grid>

                    <Grid.Row className="p-1">

                        <Grid.Column>

                            <Segment className="d-flex align-items-center justify-content-between">
                                <Header
                                    as="h5"
                                    content={row.name}
                                    subheader={row?.settings?.comment}
                                    className="mb-0"
                                />
                                {row.cabinet && <Label
                                    content={row.cabinet}
                                    color="yellow"
                                    title="Кабинет"
                                />}
                            </Segment>

                        </Grid.Column>

                    </Grid.Row>

                    <Grid.Row className="p-1" columns={2} stretched>

                        <Grid.Column>
                            <TenantData row={row} setRow={setRow} />
                        </Grid.Column>

                        <Grid.Column>
                            <TenantPays row={row} setRow={setRow} />
                        </Grid.Column>

                    </Grid.Row>

                </Grid>

            </div>}

        </>}

    </div>
}

export default Tenant;