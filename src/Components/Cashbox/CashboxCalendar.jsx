import React from "react";
import { Loader, Message } from "semantic-ui-react";
import { axios, moment } from "../../system";

const CashboxCalendar = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [month, setMonth] = React.useState(null);
    const [calendar, setCalendar] = React.useState({});

    React.useEffect(() => {

        return () => {
            setLoading(true);
            setError(null);
            setMonth(null);
        }

    }, []);

    React.useEffect(() => {

        setLoading(true);

        axios.post('cashbox/calendar', { month })
            .then(({ data }) => {
                setCalendar(data.calendar);
            })
            .catch(e => {
                setError(axios.getError(e));
            })
            .then(() => {
                setLoading(false);
            });

    }, [month]);

    return <div className="p-2">

        {loading && <Loader active inline="centered" className="mt-2" />}

        {!loading && error && <Message
            size="mini"
            className="mx-auto"
            error
            content={error}
            style={{ maxWidth: 500 }}
        />}

        {!loading && !error && <Calendar
            data={calendar}
            month={month}
        />}

    </div>
}

const Calendar = props => {

    const { data, month } = props;
    const [calendar, setCalendar] = React.useState([]);

    React.useEffect(() => {

        let start = moment().startOf('month').format("YYYY-MM-DD"),
            stop = moment().endOf('month').format("YYYY-MM-DD"),
            startWeek = moment(start).startOf('week').format("YYYY-MM-DD"),
            stopWeek = moment(stop).endOf('week').format("YYYY-MM-DD"),
            step = startWeek,
            day = 0,
            week = 0,
            calendar = [];

        while (step <= stopWeek) {

            if (day === 7) {
                day = 0;
                week++;
            }

            step = moment(step).add(1, 'd').format("YYYY-MM-DD");

            Boolean(!calendar[week]) && calendar.push([]);

            calendar[week].push({
                date: step,
                toMonth: step >= start && step <= stop,
            });

            day++;
        }

        setCalendar(calendar);

    }, [month]);

    return calendar.map((r, i) => {
        return <div key={i}>{r.map(row => <CalendarDay
            key={row.date}
            row={row}
        />)}</div>
    });

}

const CalendarDay = props => {

    const { row } = props;

    return <span className="mx-1">{row.date}</span>;
}

export default CashboxCalendar;