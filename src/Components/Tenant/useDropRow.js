import React from "react";
import { Button, Dropdown, Icon } from "semantic-ui-react";
import { axios } from "../../system";

const Drop = props => {

    const { load, setDrop } = props;

    return <Dropdown
        icon={null}
        trigger={<Icon
            name="trash"
            color="red"
            link={load === false}
        />}
        direction="left"
        disabled={load !== false}
    >
        <Dropdown.Menu>
            <div className="px-2 py-1 pb-2" style={{ maxWidth: 200 }}>

                <div className="mb-2 px-2" style={{
                    wordWrap: "normal",
                    whiteSpace: "normal",
                }}>
                    <small>Вы действительно хотите удалить услугу?</small>
                </div>

                <div className="d-flex">
                    <Button
                        content="Нет"
                        size="mini"
                        fluid
                    />
                    <Button
                        content="Да"
                        color="red"
                        onClick={() => setDrop(true)}
                        size="mini"
                        fluid
                    />
                </div>

            </div>
        </Dropdown.Menu>
    </Dropdown>
}

const useDropRow = ({ setRows, id, source_id }) => {

    const [load, setLoad] = React.useState(false);
    const [drop, setDrop] = React.useState(false);

    React.useEffect(() => {

        if (drop) {

            setLoad(true);

            axios.post('services/drop', { id, source_id })
                .then(({ data }) => {
                    typeof setRows == "function" && setRows(p => data.list || p);
                })
                .catch(e => {
                    setLoad(false);
                    setDrop(false);
                });
        }

    }, [drop]);

    return {
        load,
        Drop: () => <Drop
            load={load}
            setDrop={setDrop}
        />
    }
}

export default useDropRow;