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
import { useSelector } from "react-redux";
import { ROLES } from "../../../../types.js";



const InteractionForm = ({ onSubmit, onCancel, initialData }) => {
    const role = useSelector((state) => state.user.role)
    const isMIUDOL = role === ROLES.Admin
    const isGMU = role === ROLES.GMUArkhangelsk

    const [formData, setFormData] = useState({
        submissionDate: '',
        reviewDate: '',
        result: '',
        filenameSubmission: '',
        filenameResult: '',
        submissionFiles: null,
        resultFiles: null
    });

    useEffect(() => {
        if (initialData) {
            console.log("initialData", initialData);
            setFormData({
                submissionDate: initialData.submissionDate,
                reviewDate: initialData.reviewDate,
                result: initialData.result,
                filenameSubmission:  initialData.name_1,
                filenameResult: initialData.name_2
            });
        }
    }, []);


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
                <Label>Дата направления ходатайства в ГМУ</Label>
                <DateInput
                    type="date"
                    name="submissionDate"
                    value={formData.submissionDate}
                    onChange={handleInputChange}
                    disabled={!isMIUDOL}
                />
            </FormGroup>
            <FormGroup>
                <Label>Дата рассмотрения ходатайства ГМУ</Label>
                <DateInput
                    type="date"
                    name="reviewDate"
                    value={formData.reviewDate}
                    onChange={handleInputChange}
                    disabled={!isGMU}
                />
            </FormGroup>
            <FormGroup>
                <Label>Результат рассмотрения</Label>
                <Select
                    name="result"
                    value={formData.result}
                    onChange={handleInputChange}
                    disabled={!isGMU}
                >
                    <option value={undefined}>Выберите результат</option>
                    <option>Удовлетворено</option>
                    <option>Отказано</option>
                    <option>Частично удовлетворено</option>
                </Select>
            </FormGroup>

            <FormGroup>
                <Label>Направленные в ГМУ файлы</Label>
                <FileUploadContainer>
                    {(formData.submissionFiles || formData.filenameSubmission) ? (
                        <SelectedFile>
                            {formData.submissionFiles?.name ?? formData.filenameSubmission}
                            <RemoveFileButton
                                type="button"
                                onClick={() => removeFile('submissionFiles')}
                                disabled={!isMIUDOL}
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
                                disabled={!isMIUDOL}
                            />
                            Выберите PDF-файл
                        </FileUploadLabel>
                    )}
                </FileUploadContainer>
            </FormGroup>
            <FormGroup>
                <Label>Файлы результатов рассмотрения</Label>
                <FileUploadContainer>
                    {(formData.resultFiles || formData.filenameResult) ? (
                        <SelectedFile>
                            {formData.resultFiles?.name ?? formData.filenameResult}
                            <RemoveFileButton
                                type="button"
                                onClick={() => removeFile('resultFiles')}
                                disabled={!isGMU}
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
                                disabled={!isGMU}
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