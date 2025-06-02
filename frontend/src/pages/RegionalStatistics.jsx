import React from 'react';
import styled from 'styled-components';
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { FileSpreadsheet, Download } from 'lucide-react';
import { downloadAPI } from '../api/index.js';
import { downloadExcel } from '../utils/downloadExcel.js';

const Container = styled.div`
    width: 100%;
    height: calc(100vh - 65px);
    margin: 0 auto;
    padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${props => props.theme.colors.background};
    color: #ffffff;
    overflow-y: auto;
`;

const SectionsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: 1400px;
    margin: 0 auto;
`;

const Section = styled.section`
    width: 100%;
    animation: fadeIn 0.5s ease-out;

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

const SectionTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: #ffffff;
    padding-bottom: 8px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    display: flex;
    align-items: center;
`;

const DocumentGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    width: 100%;


    @media (min-width: 1200px) {
        grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
    }
`;

const DocumentCard = styled.div`
    background-color: ${props => props.theme.colors.surface};
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border: 1px solid ${props => props.theme.colors.border};
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        border-color: #a0a0ff;
    }
`;

const CardHeader = styled.div`
    padding: 16px 20px;
    background-color: ${props => props.theme.colors.surface};
    border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const DocumentName = styled.h3`
    font-size: 1.125rem;
    font-weight: 500;
    color: #ffffff;
    margin: 0;
`;

const CardContent = styled.div`
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
`;

const DownloadLink = styled.a`
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #e0e0e0;
    text-decoration: none;
    font-size: 0.9375rem;
    padding: 12px;
    border-radius: 4px;
    background-color: #232339;
    transition: all 0.25s ease;
    margin-top: 8px;

    &:hover {
        color: #ffffff;
    }

    &:active {
        transform: scale(0.98);
    }
`;

const FileInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const ExcelIcon = styled(FileSpreadsheet)`
    color: #a0a0ff;
    flex-shrink: 0;
`;

const DownloadIcon = styled(Download)`
    color: #a0a0ff;
    transition: all 0.2s ease;

    ${DownloadLink}:hover & {
        opacity: 1;
        transform: translateY(2px);
    }
`;

export const RegionalStatistics = () => {
    const downloadingMap = {
        'Активы НП':           downloadAPI.getDebtorActivesStat,
        'Статистика регионов': downloadAPI.getStatistics
    };
    const statNames = Object.keys(downloadingMap);

    const documentData = [
        {
            title: 'Взыскание по 47 ст.',
            isArchive: false,
            isDerived: false,
        },
        {
            title: 'Взыскание по 47 ст. Архив',
            isArchive: true,
            isDerived: false,
        },
        {
            title: 'Производный долг',
            isArchive: false,
            isDerived: true,
        },
        {
            title: 'Производный долг Архив',
            isArchive: true,
            isDerived: true,
        },
    ];

    const handleDownload = async (
        e,
        statName,
        isArchive,
        isDerived
    ) => {
        e.preventDefault();

        try {
            enqueueSnackbar("Начало загрузки...",  { variant: "info" });

            const apiTarget =  downloadingMap[statName];
            const response = await apiTarget(null, isArchive, isDerived);

            downloadExcel(response);
            enqueueSnackbar("Загружено",  { variant: "info" });
        } catch (error) {
            console.log(error);
            enqueueSnackbar("Ошибка загрузки файла", { variant: "error" });
        }
    };

    return (
        <Container>
            <SectionsWrapper>
                {documentData.map((section) => (
                    <Section key={section.id}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <DocumentGrid>
                            {statNames.map(
                                (statName, i) => (
                                    <DocumentCard key={i}>
                                        <CardHeader>
                                            <DocumentName>{statName}</DocumentName>
                                        </CardHeader>
                                        <CardContent>
                                            <DownloadLink
                                                href="#"
                                                onClick={(e) =>
                                                    handleDownload(
                                                        e,
                                                        statName,
                                                        section.isArchive,
                                                        section.isDerived
                                                    )
                                                }
                                            >
                                                <FileInfo>
                                                    <ExcelIcon size={20} />
                                                    {statName + `.xlsx`}
                                                </FileInfo>
                                                <DownloadIcon size={18} />
                                            </DownloadLink>
                                        </CardContent>
                                    </DocumentCard>
                                )
                            )}
                        </DocumentGrid>
                    </Section>
                ))}
            </SectionsWrapper>
            <SnackbarProvider
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                maxSnack={1}
                autoHideDuration={5000}
            />
        </Container>
    );
};

