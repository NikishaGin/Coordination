import { useState, useEffect } from 'react';
import {
    FormContainer,
    FormGroup,
    Label,
    DateInput,
    Select,
    FileUploadContainer,
    FileUploadLabel,
    FileInput,
    SelectedFile,
    FormActions,
    SaveButton,
    CancelButton,
    RemoveFileButton,
    NumericInput,
    NotesTextarea
} from './styles.js';

const TnoInteractionForm = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        submissionDate: '',
        reviewDate: '',
        result: '',
        kno: '',
        note: '',
        filenameSubmission: '',
        filenameResult: '',
        submissionFiles: null,
        resultFiles: null
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                submissionDate: initialData.submissionDate,
                reviewDate: initialData.reviewDate,
                result: initialData.result,
                kno: initialData.kno,
                note: initialData.note,
                filenameSubmission:  initialData.name_1,
                filenameResult: initialData.name_2
            });
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNumericInputChange = (e) => {
        const { name, value } = e.target;
        // Only allow digits
        const numericValue = value.replace(/\D/g, '');
        setFormData({
            ...formData,
            [name]: numericValue
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        } else if (files.length > 0) {
            alert('Пожалуйста, загрузите файл в формате PDF');
        }
    };

    const removeFile = (fieldName) => {
        const filename = {
            submissionFiles: "filenameSubmission",
            resultFiles: "filenameResult"
        }
        setFormData({
            ...formData,
            [fieldName]: null,
            [filename[fieldName]]: ""
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({id: initialData?.id, ...formData});
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormGroup>
                <Label>Дата направления запроса в ТНО</Label>
                <DateInput
                    type="date"
                    name="submissionDate"
                    value={formData.submissionDate}
                    onChange={handleInputChange}
                />
            </FormGroup>

            <FormGroup>
                <Label>Код ТНО</Label>
                <NumericInput
                    type="text"
                    name="kno"
                    value={formData.kno}
                    onChange={handleNumericInputChange}
                    placeholder="Введите код ТНО (только цифры)"
                />
            </FormGroup>

            <FormGroup>
                <Label>Запрос в ТНО</Label>
                <FileUploadContainer>
                    {(formData.submissionFiles || formData.filenameSubmission) ? (
                        <SelectedFile>
                            {formData.submissionFiles?.name ?? formData.filenameSubmission}
                            <RemoveFileButton
                                type="button"
                                onClick={() => removeFile('submissionFiles')}
                            >
                                ✕
                            </RemoveFileButton>
                        </SelectedFile>
                    ) : (
                        <FileUploadLabel>
                            <FileInput
                                type="file"
                                name="submissionFiles"
                                accept="application/pdf"
                                onChange={handleFileChange}
                            />
                            Выберите PDF-файл
                        </FileUploadLabel>
                    )}
                </FileUploadContainer>
            </FormGroup>

            <FormGroup>
                <Label>Дата ответа ТНО</Label>
                <DateInput
                    type="date"
                    name="reviewDate"
                    value={formData.reviewDate}
                    onChange={handleInputChange}
                />
            </FormGroup>

            <FormGroup>
                <Label>Статус рассмотрения</Label>
                <Select
                    name="result"
                    value={formData.result}
                    onChange={handleInputChange}
                >
                    <option>Выберите статус</option>
                    <option>Исполнено</option>
                    <option>Исполнено частично</option>
                    <option>Промежуточный ответ</option>
                    <option>Не исполнено</option>
                </Select>
            </FormGroup>

            <FormGroup>
                <Label>Ответ ТНО</Label>
                <FileUploadContainer>
                    {(formData.resultFiles || formData.filenameResult) ? (
                        <SelectedFile>
                            {formData.resultFiles?.name ?? formData.filenameResult}
                            <RemoveFileButton
                                type="button"
                                onClick={() => removeFile('resultFiles')}
                            >
                                ✕
                            </RemoveFileButton>
                        </SelectedFile>
                    ) : (
                        <FileUploadLabel>
                            <FileInput
                                type="file"
                                name="resultFiles"
                                accept="application/pdf"
                                onChange={handleFileChange}
                            />
                            Выберите PDF-файл
                        </FileUploadLabel>
                    )}
                </FileUploadContainer>
            </FormGroup>

            <FormGroup>
                <Label>Примечание</Label>
                <NotesTextarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Введите примечание"
                />
            </FormGroup>

            <FormActions>
                <SaveButton type="submit">Сохранить</SaveButton>
                <CancelButton type="button" onClick={onCancel}>
                    Отменить
                </CancelButton>
            </FormActions>
        </FormContainer>
    );
};

export default TnoInteractionForm;