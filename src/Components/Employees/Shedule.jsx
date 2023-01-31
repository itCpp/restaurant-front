import { useCallback } from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Dimmer, Dropdown, Header, Icon, Label, Loader, Modal, Popup, Table } from "semantic-ui-react";
import { setShowShedule } from "../../store/actions";
import { axios, moment, ucFirst } from "../../system";
import { createCalendarPlace } from "../Cashbox/CashboxCalendar";

const Shedule = props => {

    const d = useDispatch();
    const { showShedule } = useSelector(s => s.main);
    const open = Boolean(showShedule);

    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(null);
    const [calendar, setCalendar] = useState([]);
    const [options, setOptions] = useState([]);
    const [processings, setProcessings] = useState([]);
    const [days, setDays] = useState({});

    useEffect(() => {
        let m = props.month || moment().format("YYYY-MM");
        setMonth(m);
        setCalendar(createCalendarPlace(m));
    }, [props.month]);

    useEffect(() => {

        if (open) {

            showShedule?.shedule && setDays(showShedule.shedule);
            setLoading(true);

            axios.post('employees/shedule', { id: showShedule?.id, month })
                .then(({ data }) => {
                    setOptions(data.options);
                    setProcessings(data.processings || []);
                    setDays(data?.shedule?.days || {});
                })
                .catch(e => { })
                .then(() => setLoading(false));
        }

        return () => {
            setDays({});
            setProcessings([]);
            setLoading(true);
        }

    }, [open]);

    return <Modal
        open={open}
        header={`График работы ${showShedule?.work_shedule} ${showShedule?.work_shedule_time}`}
        centered={false}
        closeIcon
        onClose={() => d(setShowShedule(false))}
        style={{ width: 1000 }}
        content={<div className="content">

            <Header
                as="h3"
                content={showShedule?.fullname}
                subheader={ucFirst(moment(month || new Date).format("MMMM YYYY"))}
                className="text-center"
            />

            <Table basic celled striped>

                <Table.Body>

                    <Table.Row textAlign="center">
                        <Table.Cell style={{ width: "calc(100% / 7)" }}><strong>ПН</strong></Table.Cell>
                        <Table.Cell style={{ width: "calc(100% / 7)" }}><strong>ВТ</strong></Table.Cell>
                        <Table.Cell style={{ width: "calc(100% / 7)" }}><strong>СР</strong></Table.Cell>
                        <Table.Cell style={{ width: "calc(100% / 7)" }}><strong>ЧТ</strong></Table.Cell>
                        <Table.Cell style={{ width: "calc(100% / 7)" }}><strong>ПТ</strong></Table.Cell>
                        <Table.Cell style={{ width: "calc(100% / 7)" }}><strong className="text-danger">СБ</strong></Table.Cell>
                        <Table.Cell style={{ width: "calc(100% / 7)" }}><strong className="text-danger">ВС</strong></Table.Cell>
                    </Table.Row>

                    {calendar.map((week, i) => <Table.Row key={i}>

                        {week.map((day, key) => <TableCellDay
                            key={key}
                            day={day}
                            options={options}
                            processings={processings}
                            employee={showShedule?.id}
                            employeeData={showShedule || {}}
                            days={days}
                            setDays={setDays}
                        />)}

                    </Table.Row>)}

                </Table.Body>

            </Table>

            <Dimmer active={loading} inverted>
                <Loader />
            </Dimmer>

            {options.map(r => <Label size="small" key={r.value} color={r.color}>
                <strong>{r.text}</strong>{' - '}
                <span>{r.comment}</span>
            </Label>)}

        </div>}
    />
}

const TableCellDay = props => {

    const { day, options, employee, employeeData, processings } = props;
    const { days, setDays } = props;
    const data = days[moment(day.date).format("DD")] || {};
    const row = { ...day, ...data };
    const option = options.find(i => i.value === row.type);

    const [loading, setLoading] = useState(false);

    if (employeeData?.date_work_start && employeeData?.date_work_start > day.date)
        row.toMonth = false;

    if (employeeData?.date_work_stop && employeeData?.date_work_stop < day.date)
        row.toMonth = false;

    const change = useCallback((e, { value, date }) => {

        setLoading(true);

        axios.put('employees/shedule/set', { value, date, employee })
            .then(({ data }) => {
                setDays(p => ({ ...p, [data.day]: { ...(p[data.day] || {}), ...data.dayData } }))
            })
            .catch(e => { })
            .then(() => setLoading(false));
    }, []);

    const night = processings.find(item => item.date === day.date);

    return <Table.Cell
        disabled={!row?.toMonth}
        content={<div className="d-flex">

            <div className="flex-grow-1 d-flex align-items-center">

                {night && <span>
                    <Popup
                        trigger={<Icon name="moon" color="orange" />}
                        content={<>Ночная переработка: <b>{night.hour}</b> час. ({night.processing}) руб.</>}
                    />
                </span>}

                <span className="flex-grow-1">{moment(day.date).format("DD")}</span>

                {day?.toMonth && row?.type && option?.color && <Label
                    color={option.color}
                    empty
                    circular
                    className="mx-1"
                    size="mini"
                />}

            </div>

            {row?.toMonth && <Dropdown
                direction="left"
                date={day.date}
                loading={loading}
                disabled={loading}
                options={options.map((r, i) => ({
                    key: i,
                    ...r,
                    label: r?.color ? { color: r.color, empty: true, circular: true } : null
                }))}
                value={row.type || null}
                onChange={change}
            />}

        </div>}
    />

}

export default Shedule;