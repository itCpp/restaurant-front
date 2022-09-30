import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Grid, Header, Icon, Label, Loader, Message, Modal } from "semantic-ui-react";
import Segment from "../UI/Segment";
import { axios } from "../../system";
import TenantData from "./TenantData";
import TenantPays from "./TenantPays";
import { useNavigate } from "react-router-dom";
import TenantFiles from "./TenantFiles";
import TenantAdditionalServices from "./TenantAdditionalServices";

const Tenant = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [row, setRow] = useState({});

    const [archive, setArchive] = useState(false);
    const [drop, setDrop] = useState(false);
    const [dropError, setDropError] = useState(false);

    useEffect(() => {

        axios.post('tenant/get', { id: Number(id) })
            .then(({ data }) => {
                setRow({ ...data.row, pays: data.pays });
            })
            .catch(e => setError(axios.getError(e)))
            .then(() => setLoading(false));

        return () => {
            setLoading(true);
        }

    }, []);

    useEffect(() => {

        if (archive) {
            return () => {
                setDropError(false);
            }
        }

    }, [archive]);

    useEffect(() => {

        if (drop) {

            axios.post('tenant/drop', { id: Number(id) })
                .then(({ data }) => {
                    navigate("/income/" + data.buildingId);
                })
                .catch(e => {
                    setDropError(axios.getError(e));
                    setDrop(false);
                });
        }

    }, [drop]);

    return <div>

        <Modal
            open={archive}
            basic
            centered={false}
            size="mini"
        >
            <Header icon>
                <Icon name="archive" />
            </Header>

            <Modal.Content>
                <p className="text-center">Вы действительно хотите отправить карточку в архив?</p>
                {dropError && <p className="text-center text-danger"><b>Ошибка</b>{' '}{dropError}</p>}
            </Modal.Content>
            <Modal.Actions className="text-center">
                <Button basic color="red" inverted onClick={() => setArchive(false)} disabled={drop}>
                    <Icon name="remove" /> Нет
                </Button>
                <Button color="green" inverted onClick={() => setDrop(true)} loading={drop} disabled={drop}>
                    <Icon name="checkmark" /> Да
                </Button>
            </Modal.Actions>

        </Modal>

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

                    <Grid.Row>

                        <Grid.Column>

                            <Segment className="d-flex align-items-center justify-content-between">
                                <Header
                                    as="h2"
                                    content={row.name}
                                    subheader={row?.settings?.comment}
                                    className="mb-0"
                                />
                                <div>
                                    {row.cabinet && <Label
                                        content={row.cabinet}
                                        color="yellow"
                                        title="Кабинет"
                                        className="me-2"
                                    />}
                                    <Button
                                        icon="archive"
                                        basic
                                        circular
                                        title="Отправить в архив"
                                        onClick={() => setArchive(true)}
                                    />
                                </div>
                            </Segment>

                        </Grid.Column>

                    </Grid.Row>

                    <Grid.Row columns={2} stretched>

                        <Grid.Column>
                            <TenantData row={row} setRow={setRow} />
                        </Grid.Column>

                        <Grid.Column>
                            <TenantPays row={row} setRow={setRow} />
                        </Grid.Column>

                    </Grid.Row>

                    <Grid.Row columns={2} stretched>

                        <Grid.Column>
                            <TenantFiles row={row} setRow={setRow} />
                        </Grid.Column>

                        <Grid.Column>
                            <TenantAdditionalServices row={row} setRow={setRow} />
                        </Grid.Column>

                    </Grid.Row>

                </Grid>

            </div>}

        </>}

    </div>
}

export default Tenant;