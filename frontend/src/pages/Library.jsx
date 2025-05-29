import React, {useEffect, useState} from 'react';
import {FileText, FileSpreadsheet, FileImage, FilePieChart, File} from 'lucide-react';
import styled from 'styled-components';
import {useLocation} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {fetchGetDocuments, fetchSaveDocument} from "../store/fileStorageSlice.js";

const Wrapper = styled.div`
  background-color: ${props => props.theme.colors.background};
  color: rgb(255, 255, 255);
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  display: flex;
  justify-content: center;
  padding: 2rem;
  height: 94vh;
`;

const Container = styled.div`
  max-width: 800px;
  width: 100%;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  animation: fadeIn 0.3s ease-out;
  overflow: hidden;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: rgb(255, 255, 255);
  text-align: center;
  letter-spacing: -0.01em;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr auto;
    align-items: end;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const Input = styled.input`
  background-color: #232339;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  color: rgb(255, 255, 255);
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #a0a0ff;
  }

  &::placeholder {
    color: #888;
  }
`;

const FileInputLabel = styled.label`
  width: 278px;
  display: flex;
  align-items: center;
  background-color: #232339;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  color: rgb(255, 255, 255);
  font-size: 1rem;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #a0a0ff;
  }

  &::placeholder {
    color: #888;
  }
`;

const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

const Button = styled.button`
  background-color: #3a3a6a;
  color: #ffffff;
  border: 1px solid #3a3a6a;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #4a4a7a;
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);
    cursor: not-allowed;
  }

`;

const DocumentList = styled.div`
  margin-top: 1rem;
  animation: fadeIn 0.4s ease-out;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const TableRow = styled.tr`
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgb(56, 114, 224);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: rgb(72, 130, 240);
      text-decoration: underline;
    }
  }
`;

const FileIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgb(126, 61, 201);
  margin-right: 0.25rem;
  transition: transform 0.2s ease;

  a:hover & {
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 1rem;
  animation: pulse 2s infinite ease-in-out;

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }
`;


export const Library = () => {
    const [documentName, setDocumentName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const documents = useSelector(state => state.fileStorage.documents);

    console.log('documents', documents)

    const dispatch = useDispatch()
    const location = useLocation();


    useEffect(() => {
        dispatch(fetchGetDocuments(location.pathname))
    }, [])

    const handleDocumentNameChange = (e) => {
        setDocumentName(e.target.value);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (documentName && selectedFile) {
            dispatch(fetchSaveDocument({pathname: location.pathname, name: documentName, file: selectedFile}));
            setDocumentName('');
            setSelectedFile(null);
            const fileInput = document.getElementById('fileInput');
            if (fileInput) fileInput.value = '';
        }
    };

    const getFileIcon = (fileName) => {
        if (!fileName || typeof fileName !== 'string') return <File size={20} />;

        const extension = fileName.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'doc':
            case 'docx':
                return <FileText size={20} />;
            case 'xls':
            case 'xlsx':
                return <FileSpreadsheet size={20} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <FileImage size={20} />;
            case 'ppt':
            case 'pptx':
                return <FilePieChart size={20} />;
            default:
                return <File size={20} />;
        }
    };


    return (
        <Wrapper>
            <Container>
                <Title>{(location.pathname === "/library-documentation") ? "Нормативно-правовая документация" : "Положительная практика"}</Title>

                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Input
                            type="text"
                            value={documentName}
                            onChange={handleDocumentNameChange}
                            placeholder="Введите название документа"
                        />
                    </InputGroup>

                    <InputGroup>
                        <FileInputLabel>
                            {selectedFile ? selectedFile.name : 'Выберите файл...'}
                            <FileInput
                                type="file"
                                id="fileInput"
                                onChange={handleFileChange}
                                accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf"
                            />
                        </FileInputLabel>
                    </InputGroup>

                    <Button
                        type="submit"
                        disabled={!documentName || !selectedFile}
                    >
                        Добавить
                    </Button>
                </Form>

                <DocumentList>
                    {documents.length > 0 ? (
                        <Table>
                            <thead>
                            <TableRow>
                                <TableHeader>Название документа</TableHeader>
                                <TableHeader>Ссылка на скачивание</TableHeader>
                            </TableRow>
                            </thead>
                            <tbody>
                            {documents.map((doc, index) => (
                                <TableRow key={index}>
                                    <TableCell>{doc.name}</TableCell>
                                    <TableCell>
                                        <a href={doc.url} download={doc.filename}>
                                            <FileIcon>
                                                {getFileIcon(doc.url)}
                                            </FileIcon>
                                            Скачать
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </tbody>
                        </Table>
                    ) : (
                        <EmptyState>Документы появятся здесь после добавления</EmptyState>
                    )}
                </DocumentList>
            </Container>
        </Wrapper>
    );
};

