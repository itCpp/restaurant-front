import moment from "moment";
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Grid, Header, Icon, Modal, Statistic } from "semantic-ui-react";
import { setShowSalaryMore } from "../../store/actions";

const SalaryMore = props => {

    const d = useDispatch();
    const data = useSelector(s => s?.main?.showSalaryMore);
    const open = Boolean(data);
    const [accrd, setAccord] = useState(-1);

    const handleClick = useCallback((e, { index }) => {
        setAccord(a => a === index ? -1 : index);
    }, [])

    return <Modal
        open={open}
        header="Информация о начислениях"
        centered={false}
        size="small"
        closeIcon
        onClose={() => {
            setAccord(-1);
            d(setShowSalaryMore(false));
        }}
        content={<div className="content">

            <Header
                as="h3"
                content={data?.fullname}
                subheader={data?.job_title}
            />

            <div className="d-flex justify-content-between px-3">

                <Statistic size="tiny">
                    <Statistic.Value>{data?.salary || 0}</Statistic.Value>
                    <Statistic.Label>Оклад</Statistic.Label>
                </Statistic>

                <Statistic size="tiny">
                    <Statistic.Value>{data?.toPayoff || 0}</Statistic.Value>
                    <Statistic.Label>Начислено</Statistic.Label>
                </Statistic>

                <Statistic size="tiny">
                    <Statistic.Value>{data?.debt || 0}</Statistic.Value>
                    <Statistic.Label>Долг</Statistic.Label>
                </Statistic>

                <Statistic size="tiny">
                    <Statistic.Value>{data?.prepayment || 0}</Statistic.Value>
                    <Statistic.Label>Выдано</Statistic.Label>
                </Statistic>

                <Statistic size="tiny">
                    <Statistic.Value>{data?.balance || 0}</Statistic.Value>
                    <Statistic.Label>Остаток</Statistic.Label>
                </Statistic>

            </div>

            <Accordion>

                <Accordion.Title index={0} active={accrd === 0} onClick={handleClick}>
                    <Icon name="dropdown" />
                    Начисления за каждый день
                </Accordion.Title>
                <Accordion.Content active={accrd === 0}>
                    {(data.parts_data || []).length === 0 && <div className="my-2 text-center">
                        <small className="opacity-40">Данных нет</small>
                    </div>}
                    {(data.parts_data || []).length > 0 && <Grid columns={3} padded>
                        {data.parts_data.map((r, i) => <Grid.Column key={i} className="py-1 d-flex">
                            <span>{moment(r.date).format("DD.MM.YYYY")}</span>
                            <span className="ms-2">{(r.sum || 0).toFixed(2)}</span>
                        </Grid.Column>)}
                    </Grid>}
                </Accordion.Content>

            </Accordion>

        </div>}
    />
}

export default SalaryMore;