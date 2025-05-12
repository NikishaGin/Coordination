import React from 'react';
import styled from 'styled-components';
import { FileSpreadsheet } from 'lucide-react';



const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const Section = styled.section`
  margin-bottom: 32px;
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 1.375rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffffff;
`;

const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  width: 100%;
`;

const DocumentCard = styled.div`
  background: #1c2538;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled.div`
  padding: 16px 20px;
  background: #252f44;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const DocumentName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
  margin: 0;
`;

const CardContent = styled.div`
  padding: 16px 20px;
`;

const DownloadLink = styled.a`
  display: flex;
  align-items: center;
  color: #ffffff;
  text-decoration: none;
  font-size: 0.9375rem;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
  }
`;

const ExcelIcon = styled(FileSpreadsheet)`
  color: #4CAF50;
  margin-right: 8px;
  flex-shrink: 0;
`;

export const RegionalStatistics = () => {
    const documentData = [
        {
            id: 1,
            title: 'Взыскание по 47 ст.',
            documents: [
                {
                    id: 1,
                    name: 'Активы НП',
                    filename: 'Активы НП.xlsx'
                },
                {
                    id: 2,
                    name: 'Статистика регионов',
                    filename: 'Статистика регионов.xlsx'
                }
            ]
        },
        {
            id: 2,
            title: 'Взыскание по 47 ст. Архив',
            documents: [
                {
                    id: 3,
                    name: 'Активы НП',
                    filename: 'Активы НП.xlsx'
                },
                {
                    id: 4,
                    name: 'Статистика регионов',
                    filename: 'Статистика регионов.xlsx'
                }
            ]
        },
        {
            id: 3,
            title: 'Производный долг',
            documents: [
                {
                    id: 5,
                    name: 'Активы НП',
                    filename: 'Активы НП.xlsx'
                },
                {
                    id: 6,
                    name: 'Статистика регионов',
                    filename: 'Статистика регионов.xlsx'
                }
            ]
        },
        {
            id: 4,
            title: 'Производный долг Архив',
            documents: [
                {
                    id: 7,
                    name: 'Активы НП',
                    filename: 'Активы НП.xlsx'
                },
                {
                    id: 8,
                    name: 'Статистика регионов',
                    filename: 'Статистика регионов.xlsx'
                }
            ]
        }
    ];

    return (
        <>
            <Container>
                {documentData.map((section) => (
                    <Section key={section.id}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <DocumentGrid>
                            {section.documents.map((documentItem) => (
                                <DocumentCard key={documentItem.id}>
                                    <CardHeader>
                                        <DocumentName>{documentItem.name}</DocumentName>
                                    </CardHeader>
                                    <CardContent>
                                        <DownloadLink href="#" onClick={(e) => e.preventDefault()}>
                                            <ExcelIcon size={18} />
                                            {documentItem.filename}
                                        </DownloadLink>
                                    </CardContent>
                                </DocumentCard>
                            ))}
                        </DocumentGrid>
                    </Section>
                ))}
            </Container>
        </>
    );
}

