import React from "react";
import { Column } from '@antv/g2plot';

const ChartIncomesExpenses = props => {

    const { data } = props;
    const plot = React.useRef();
    const container = React.useRef();

    React.useEffect(() => {

        plot.current && plot.current.changeData(data);

    }, [data]);

    React.useEffect(() => {

        plot.current = new Column(container.current, {
            data,
            isGroup: true,
            xField: 'month',
            yField: 'sum',
            seriesField: 'type',
            dodgePadding: 2,
            label: {
                position: 'middle', // 'top', 'middle', 'bottom'
                layout: [
                    { type: 'interval-adjust-position' },
                    { type: 'interval-hide-overlap' },
                    { type: 'adjust-color' },
                ],
            },
            color: ({ type }) => {
                if (type === "Доход") return "#20c997";
                else if (type === "Расход") return "#dc3545";
                else return "#0d6efd";
            },
        })

        plot.current.render();

        return () => {
            plot.current.destroy();
        }

    }, []);

    return <div className="mt-4 mx-2 px-3 py-2 rounded" style={{ background: "#fff" }}>
        <div ref={container} />
    </div>

}

export default ChartIncomesExpenses;