import { Button, Dropdown } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { setShowAdd, setIncomeSourceAdd, setPartAdd, setIncomeFilter } from "../../store/incomes/actions";
import { useCallback, useEffect, useState } from "react";

const IncomeHeaderButtons = () => {

    const dispatch = useDispatch();
    const { filter } = useSelector(s => s.incomes);

    const [filters, setFilters] = useState({
        archive: false,
        all: false,
        rent: false,
        free: false,
    })

    useEffect(() => {

        let data = {};

        if (filters.archive) {
            if (filters.archive) data.onlyArchive = true;
            dispatch(setIncomeFilter(data));
        }
        else if (filters.all || filters.rent || filters.free) {
            if (filters.archive) data.onlyArchive = true;
            if (filters.rent && !filters.all) data.onlyRent = true;
            if (filters.free && !filters.all) data.onlyFree = true;
            dispatch(setIncomeFilter(data));
        }

    }, [filters]);

    // const setFilter = (data) => {
    //     typeof data?.onlyArchive == "boolean" && delete (data.onlyArchive);
    //     dispatch(setIncomeFilter(Boolean(archive) ? { ...data, onlyArchive: true } : data));
    // }

    return <div className="d-flex justify-content-end">

        <Dropdown
            trigger={<Button
                basic
                icon="filter"
                color={(
                    Boolean(filter?.onlyArchive)
                    || Boolean(filter?.onlyRent)
                    || Boolean(filter?.onlyFree)
                ) ? "orange" : null}
            />}
            icon={null}
            pointing="top left"
            direction="left"
        >
            <Dropdown.Menu>
                <Dropdown.Header icon='tags' content='Фильтрация' />
                <Dropdown.Divider className="my-0" />
                <Dropdown.Item
                    label={{ color: Boolean(filter?.onlyArchive) ? 'yellow' : null, empty: true, circular: true }}
                    text='В архиве'
                    onClick={() => setFilters(p => ({ ...p, archive: !p.archive }))}
                    active={Boolean(filter?.onlyArchive)}
                />
                <Dropdown.Divider className="my-0" />
                <Dropdown.Item
                    label={{ color: (!Boolean(filter?.onlyRent) && !Boolean(filter?.onlyFree)) ? 'blue' : null, empty: true, circular: true }}
                    text='Все помещения'
                    onClick={() => setFilters(p => ({ ...p, all: true }))}
                    active={!Boolean(filter?.onlyRent) && !Boolean(filter?.onlyFree)}
                    disabled={Boolean(filter?.onlyArchive)}
                />
                <Dropdown.Item
                    label={{ color: Boolean(filter?.onlyRent) ? 'red' : null, empty: true, circular: true }}
                    text='Арендованные'
                    onClick={() => setFilters(p => ({ ...p, all: false, rent: true, free: false }))}
                    active={Boolean(filter?.onlyRent)}
                    disabled={Boolean(filter?.onlyArchive)}
                />
                <Dropdown.Item
                    label={{ color: Boolean(filter?.onlyFree) ? 'green' : null, empty: true, circular: true }}
                    text='Свободные'
                    onClick={() => setFilters(p => ({ ...p, all: false, rent: false, free: true }))}
                    active={Boolean(filter?.onlyFree)}
                    disabled={Boolean(filter?.onlyArchive)}
                />
            </Dropdown.Menu>
        </Dropdown>

        <Dropdown
            floating
            trigger={<Button
                basic
                icon="plus"
            />}
            icon={null}
            pointing="top left"
            direction="left"
        >
            <Dropdown.Menu>
                <Dropdown.Item
                    content="Внести оплату"
                    icon="plus"
                    onClick={() => dispatch(setShowAdd(true))}
                />
                <Dropdown.Divider className="my-0" />
                <Dropdown.Item
                    content="Создать раздел"
                    icon="factory"
                    onClick={() => dispatch(setPartAdd(true))}
                />
                <Dropdown.Item
                    content="Добавить арендатора"
                    icon="plus square"
                    onClick={() => dispatch(setIncomeSourceAdd(true))}
                />
            </Dropdown.Menu>
        </Dropdown>

    </div>

}

export default IncomeHeaderButtons;