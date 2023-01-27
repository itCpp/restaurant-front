import React from "react";
import { Button } from "semantic-ui-react";
import { axios } from "../../system";

const ParkingHeaderButtons = () => {

    const [load, setLoad] = React.useState(false);

    React.useEffect(() => {

        return () => {
            setLoad(false);
        }

    }, []);

    const downloadFile = () => {

        setLoad(true);

        axios.post('parking/docx', {}, {
            responseType: 'blob',
        })
            .then(response => {

                const href = URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = href;
                // link.setAttribute('download'); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            })
            .catch(() => { })
            .then(() => setLoad(false));

    }

    return <div className="d-flex justify-content-end">

        <Button
            basic
            icon="file word"
            title="Скачать файл со списком автомобилей"
            className="px-2 py-2"
            onClick={downloadFile}
            loading={load}
            disabled={load}
        />

    </div>
}

export default ParkingHeaderButtons;
