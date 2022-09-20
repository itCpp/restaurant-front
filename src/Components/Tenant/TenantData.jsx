import moment from "moment/moment";
import { useDispatch } from "react-redux";
import { Button, Grid, Header, Icon } from "semantic-ui-react";
import { setIncomeSourceAdd } from "../../store/incomes/actions";
import IncomeSourceAdd from "../Incomes/IncomeSourceAdd";
import Segment from "../UI/Segment";

const TenantData = props => {

    const { row, setRow } = props;
    const dispatch = useDispatch();

    return <Segment className="pb-4">

        <IncomeSourceAdd
            setRow={setRow}
        />

        <div className="mb-4 d-flex align-items-center">

            <Header as="h3" className="mb-0 flex-grow-1">Основные данные</Header>

            <div>
                {row.is_free && <Icon name="check" color="green" title="Свободное помещение" />}
                {Boolean(row.fine) && <Icon name="ban" color="red" title="Имеется неоплаченная пеня" />}
                {row.overdue && <Icon name="usd" color="red" title="Просроченный платеж" />}
                {row.is_overdue && <Icon name="calendar" color="red" title="Имеется просроченный платеж более ранних периодов" />}
                {row.is_parking && <Icon name="car" color="blue" title="Аренда парковочного места" />}
                {row.is_internet && <Icon name="world" color="blue" title="Услуги интернета" />}

                <Button
                    icon="pencil"
                    basic
                    circular
                    size="mini"
                    title="Редактировать"
                    onClick={() => dispatch(setIncomeSourceAdd(row))}
                />

            </div>

        </div>

        <Grid>

            <Grid.Row columns="equal" className="py-2">

                <Grid.Column>
                    <strong>Кабинет</strong>
                </Grid.Column>

                <Grid.Column width={12}>
                    {row.cabinet}
                </Grid.Column>

            </Grid.Row>

            <Grid.Row columns="equal" className="py-2">

                <Grid.Column>
                    <strong>Компания</strong>
                </Grid.Column>

                <Grid.Column width={12}>
                    {row.name}
                    {Boolean(row?.settings?.comment) && <div><small>{row.settings.comment}</small></div>}
                </Grid.Column>

            </Grid.Row>

            <Grid.Row columns="equal" className="py-2">

                <Grid.Column>
                    <strong>Контактное лицо</strong>
                </Grid.Column>

                <Grid.Column width={12}>
                    <span>{row.contact_person}{' '}</span>
                    {row.contact_number && <span>(<a href={`tel:${row.contact_number}`}>{row.contact_number}</a>)</span>}
                </Grid.Column>

            </Grid.Row>

            <Grid.Row columns="equal" className="py-2">

                <Grid.Column>
                    <strong>ИНН</strong>
                </Grid.Column>

                <Grid.Column width={12}>
                    {row.inn}
                </Grid.Column>

            </Grid.Row>

            <Grid.Row columns="equal" className="py-2">

                <Grid.Column>
                    <strong>Дата аренды</strong>
                </Grid.Column>

                <Grid.Column width={12}>
                    <div>
                        {row.date && <span>с {moment(row.date).format("DD.MM.YYYY")}</span>}
                        {row.date_to && <span>{' по '}{moment(row.date_to).format("DD.MM.YYYY")}</span>}
                    </div>
                    {Boolean(row?.settings?.comment_date) && <div><small>{row.settings.comment_date}</small></div>}
                </Grid.Column>

            </Grid.Row>

            <Grid.Row columns="equal" className="py-2">

                <Grid.Column>
                    <strong>Площадь{' '}</strong>
                    <span>{row.space} м²</span>
                </Grid.Column>

                <Grid.Column>
                    <strong>Стоимость 1м²{' '}</strong>
                    <span>{row.price}</span>
                </Grid.Column>

                <Grid.Column>
                    <strong>Цена{' '}</strong>
                    <span>{Number(row.space) * Number(row.price)}</span>
                </Grid.Column>

            </Grid.Row>

            <Grid.Row columns="equal" className="py-2">

                <hr className="grid-absolute" />

                <Grid.Column>
                    <strong><Icon name="car" disabled />Парковка</strong>
                </Grid.Column>

                <Grid.Column width={12}>
                    {row.is_parking ? "Да" : "Нет"}
                </Grid.Column>

            </Grid.Row>

            {row.is_parking && <>

                {Boolean(row?.settings?.parking_date) && <Grid.Row columns="equal" className="py-2">

                    <Grid.Column>
                        <strong>Дата начала</strong>
                    </Grid.Column>

                    <Grid.Column width={12}>
                        с {moment(row.settings.parking_date).format("DD.MM.YYYY")}
                    </Grid.Column>

                </Grid.Row>}

                {Boolean(row?.settings?.parking_price) && <Grid.Row columns="equal" className="py-2">
                    <Grid.Column><strong>Стоимость аренды</strong></Grid.Column>
                    <Grid.Column width={12}>{row.settings.parking_price}</Grid.Column>
                </Grid.Row>}

                {Boolean(row?.settings?.parking_count) && <Grid.Row columns="equal" className="py-2">
                    <Grid.Column><strong>Машиномест</strong></Grid.Column>
                    <Grid.Column width={12}>{row.settings.parking_count}</Grid.Column>
                </Grid.Row>}

                {Boolean(row?.settings?.car_number) && <Grid.Row columns="equal" className="py-2">
                    <Grid.Column><strong>Гос. номер</strong></Grid.Column>
                    <Grid.Column width={12}>{row.settings.car_number}</Grid.Column>
                </Grid.Row>}

            </>}

            <Grid.Row columns="equal" className="py-2">

                <hr className="grid-absolute" />

                <Grid.Column>
                    <strong><Icon name="world" disabled />Интернет</strong>
                </Grid.Column>

                <Grid.Column width={12}>
                    {row.is_internet ? "Да" : "Нет"}
                </Grid.Column>

            </Grid.Row>

            {row.is_internet && <>

                {Boolean(row?.settings?.internet_date) && <Grid.Row columns="equal" className="py-2">

                    <Grid.Column>
                        <strong>Дата начала</strong>
                    </Grid.Column>

                    <Grid.Column width={12}>
                        с {moment(row.settings.internet_date).format("DD.MM.YYYY")}
                    </Grid.Column>

                </Grid.Row>}

                {Boolean(row?.settings?.internet_price) && <Grid.Row columns="equal" className="py-2">
                    <Grid.Column><strong>Стоимость</strong></Grid.Column>
                    <Grid.Column width={12}>{row.settings.internet_price}</Grid.Column>
                </Grid.Row>}

            </>}

        </Grid>

    </Segment>

}

export default TenantData;