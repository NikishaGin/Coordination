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
import { useSelector } from "react-redux";
import { ROLES } from "../../../../types.js";


const TnoInteractionCard = ({ data, onEdit }) => {
    const role = useSelector((state) => state.user.role)
    const isUser = role === ROLES.User

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

    return (
        <Card>
            <CardHeader>
                {!isUser && <EditButton onClick={onEdit}>Редактировать</EditButton>}
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
                        {data.result || (
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