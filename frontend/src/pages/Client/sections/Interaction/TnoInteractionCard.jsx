import {
    Card,
    CardHeader,
    CardBody,
    CardRow,
    RowLabel,
    RowValue,
    FileLink,
    EditButton,
    NoDataText
} from './styles.js';


const TnoInteractionCard = ({ data, onEdit }) => {
    const formatDate = (dateString) => {
        if (!dateString) return null;

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    const getResultText = (result) => {
        switch(result) {
            case 'approved': return 'Удовлетворено';
            case 'rejected': return 'Отказано';
            case 'partial': return 'Частично удовлетворено';
            default: return null;
        }
    };

    const getFileName = (file) => {
        if (!file) return null;
        return file.name || 'Файл';
    };

    const handleFileDownload = (file) => {
        if (!file) return;
        const fileUrl = URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = file.name;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(fileUrl);
    };

    return (
        <Card>
            <CardHeader>
                <EditButton onClick={onEdit}>Редактировать</EditButton>
            </CardHeader>

            <CardBody>
                <CardRow>
                    <RowLabel>Дата направления запроса в ТНО</RowLabel>
                    <RowValue>
                        {formatDate(data.submissionDate) || (
                            <NoDataText>Информация не заполнена</NoDataText>
                        )}
                    </RowValue>
                </CardRow>

                <CardRow>
                    <RowLabel>Код ТНО</RowLabel>
                    <RowValue>
                        {data.kno || <NoDataText>Информация не заполнена</NoDataText>}
                    </RowValue>
                </CardRow>

                <CardRow>
                    <RowLabel>Дата рассмотрения ходатайства:</RowLabel>
                    <RowValue>
                        {formatDate(data.reviewDate) || (
                            <NoDataText>Информация не заполнена</NoDataText>
                        )}
                    </RowValue>
                </CardRow>

                <CardRow>
                    <RowLabel>Результат рассмотрения:</RowLabel>
                    <RowValue>
                        {getResultText(data.result) || (
                            <NoDataText>Информация не заполнена</NoDataText>
                        )}
                    </RowValue>
                </CardRow>

                <CardRow>
                    <RowLabel>Направленные файлы:</RowLabel>
                    <RowValue>
                        {data.url_1 ? (
                            <FileLink
                                href={data.url_1}
                                download={data.name_1}
                            >
                                Файл прикреплен
                            </FileLink>
                        ) : (
                            <NoDataText>Файлы не прикреплены</NoDataText>
                        )}
                    </RowValue>
                </CardRow>

                <CardRow>
                    <RowLabel>Файлы результата:</RowLabel>
                    <RowValue>
                        {data.url_2 ? (
                            <FileLink
                                href={data.url_2}
                                download={data.name_2}
                            >
                                Файл прикреплен
                            </FileLink>
                        ) : (
                            <NoDataText>Файлы не прикреплены</NoDataText>
                        )}
                    </RowValue>
                </CardRow>

                <CardRow>
                    <RowLabel>Примечание:</RowLabel>
                    <RowValue>
                        {data.note || <NoDataText>Информация не заполнена</NoDataText>}
                    </RowValue>
                </CardRow>
            </CardBody>
        </Card>
    );
};

export default TnoInteractionCard;