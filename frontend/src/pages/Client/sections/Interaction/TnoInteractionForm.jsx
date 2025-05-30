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
        submissionFiles: null,
        resultFiles: null,
        tnoCode: '',
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                tnoCode: initialData.tnoCode || '',
                notes: initialData.notes || ''
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
        setFormData({
            ...formData,
            [fieldName]: null
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
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
                    name="tnoCode"
                    value={formData.tnoCode}
                    onChange={handleNumericInputChange}
                    placeholder="Введите код ТНО (только цифры)"
                />
            </FormGroup>

            <FormGroup>
                <Label>Запрос в ТНО</Label>
                <FileUploadContainer>
                    {formData.submissionFiles ? (
                        <SelectedFile>
                            {formData.submissionFiles.name}
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
                    <option value="">Выберите статус</option>
                    <option value="approved">Исполнено</option>
                    <option value="partially_approved">Исполнено частично</option>
                    <option value="in_progress">Промежуточный ответ</option>
                    <option value="rejected">Не исполнено</option>
                </Select>
            </FormGroup>

            <FormGroup>
                <Label>Ответ ТНО</Label>
                <FileUploadContainer>
                    {formData.resultFiles ? (
                        <SelectedFile>
                            {formData.resultFiles.name}
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
                    name="notes"
                    value={formData.notes}
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