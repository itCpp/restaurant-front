import { Header } from "semantic-ui-react";
import { IncomeFilesComponent } from "../Incomes/IncomeFiles";
import Segment from "../UI/Segment";

const TenantFiles = props => {

    return <Segment className="pb-4">

        <div className="mb-4 d-flex align-items-center">

            <Header as="h3" className="mb-0 flex-grow-1">Файлы</Header>

        </div>

        <div className="position-relative" style={{ minHeight: 70 }}>
            <IncomeFilesComponent
                show={{
                    id: props?.row?.id,
                    name: props?.row?.name
                }}
            />
        </div>

    </Segment>
}

export default TenantFiles;