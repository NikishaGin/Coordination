import {Card, CardHeader, CardBody, CardRow, RowLabel, RowValue, FileLink, EditButton, NoDataText} from './styles.js';

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

    const handleFileDownload = (file) => {
        if (!file) return;

        // Create a URL for the file
        const fileUrl = URL.createObjectURL(file);

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = file.name;

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL
        URL.revokeObjectURL(fileUrl);
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
                                    handleFileDownload(data.submissionFiles);
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
                                    handleFileDownload(data.resultFiles);
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