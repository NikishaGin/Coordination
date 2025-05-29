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
    RemoveFileButton
} from './styles.js';

const InteractionForm = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        submissionDate: '',
        reviewDate: '',
        result: '',
        submissionFiles: null,
        resultFiles: null
    });

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData });
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
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
                <Label>Дата направления ходатайства в ГМУ</Label>
                <DateInput
                    type="date"
                    name="submissionDate"
                    value={formData.submissionDate}
                    onChange={handleInputChange}
                />
            </FormGroup>

            <FormGroup>
                <Label>Дата рассмотрения ходатайства ГМУ</Label>
                <DateInput
                    type="date"
                    name="reviewDate"
                    value={formData.reviewDate}
                    onChange={handleInputChange}
                />
            </FormGroup>

            <FormGroup>
                <Label>Результат рассмотрения</Label>
                <Select
                    name="result"
                    value={formData.result}
                    onChange={handleInputChange}
                >
                    <option value="">Выберите результат</option>
                    <option value="approved">Удовлетворено</option>
                    <option value="rejected">Отказано</option>
                    <option value="partial">Частично удовлетворено</option>
                </Select>
            </FormGroup>

            <FormGroup>
                <Label>Направленные в ГМУ файлы</Label>
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
                <Label>Файлы результатов рассмотрения</Label>
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

            <FormActions>
                <SaveButton type="submit">Сохранить</SaveButton>
                <CancelButton type="button" onClick={onCancel}>
                    Отменить
                </CancelButton>
            </FormActions>
        </FormContainer>
    );
};

export default InteractionForm;