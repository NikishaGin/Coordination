import {Card, CardHeader, CardBody, CardRow, RowLabel, RowValue, FileLink, EditButton, NoDataText} from './styles.js';
import {downloadExcel} from '../../../../utils/downloadExcel.js'


const InteractionCard = ({ data, onEdit }) => {
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


    return (
        <Card>
            <CardHeader>
                <EditButton onClick={onEdit}>Редактировать</EditButton>
            </CardHeader>

            <CardBody>
                <CardRow>
                    <RowLabel>Дата направления ходатайства:</RowLabel>
                    <RowValue>
                        {formatDate(data.submissionDate) || (
                            <NoDataText>Информация не заполнена</NoDataText>
                        )}
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
                        {data.submissionFiles ? (
                            <FileLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    downloadExcel(data.submissionFiles);
                                }}
                            >
                                {getFileName(data.submissionFiles)}
                            </FileLink>
                        ) : (
                            <NoDataText>Файлы не прикреплены</NoDataText>
                        )}
                    </RowValue>
                </CardRow>

                <CardRow>
                    <RowLabel>Файлы результата:</RowLabel>
                    <RowValue>
                        {data.resultFiles ? (
                            <FileLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    downloadExcel(data.resultFiles);
                                }}
                            >
                                {getFileName(data.resultFiles)}
                            </FileLink>
                        ) : (
                            <NoDataText>Файлы не прикреплены</NoDataText>
                        )}
                    </RowValue>
                </CardRow>
            </CardBody>
        </Card>
    );
};

export default InteractionCard;