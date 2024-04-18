import {
    Box,
    Button,
    Card,
    Display,
    Divider,
    Text,
    colors
} from '@impact-market/ui';
import { Breakpoints } from '../Breakpoints';
import { PDFDocument } from 'pdf-lib';
import { useState } from 'react';
import Certificate from './Certificate';
import html2canvas from 'html2canvas';
import Input from '../Input';
import Modal from '../../modals/Modal';
import styled from 'styled-components';

export const CardWrapper = styled(Card)`
    overflow: 'hidden';
    margin-bottom: 2rem;
    p {
        color: ${colors.g400};
        font-weight: 600;
    }

    h1 {
        font-weight: 600;
    }

    @media (max-width: ${Breakpoints.xsmall}) {
        .certificate-buttons {
            flex-wrap: wrap;

            button {
                width: 100%;
            }
        }
    }
`;

const GenerateCertificate = (props: any) => {
    const {
        title,
        cardHeading,
        cardTip,
        firstNamePlaceholder,
        lastNamePlaceholder,
        generate,
        viewCertificate,
        downloadCertificate,
        dismiss,
        sponsor,
        certificate,
        completionDate
    } = props;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [pngDataUrl, setPngDataUrl] = useState('');
    const certificateData = { ...certificate, sponsor, title, completionDate };

    const handleConvertToPNG = () => {
        setLoading(true);
        const elementToCapture = document.getElementById(
            'htmlElementToCapture'
        );

        html2canvas(elementToCapture, { allowTaint: true, useCORS: true }).then(
            (canvas) => {
                const dataURL = canvas.toDataURL('image/jpg');

                setPngDataUrl(dataURL);
                setLoading(false);
                setIsReady(true);
            }
        );
    };

    const handleConvertToPDF = async () => {
        if (!pngDataUrl) {
            console.error('No PNG image to convert to PDF');
            return;
        }

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([841.89, 595.276]); // A4 dimensions in points (landscape)

        const pngImage = await pdfDoc.embedPng(pngDataUrl);
        const { width, height } = pngImage.scale(1);
        const scaleFactor = Math.min(841.89 / width, 595.276 / height);

        // Calculate the centered position
        const xPosition = (841.89 - width * scaleFactor) / 2;
        const yPosition = (595.276 - height * scaleFactor) / 2;

        page.drawImage(pngImage, {
            x: xPosition,
            y: yPosition,
            width: width * scaleFactor,
            height: height * scaleFactor
        });

        const pdfBytes = await pdfDoc.save();

        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

        const pdfDataUrl = URL.createObjectURL(pdfBlob);

        const a = document.createElement('a');
        a.href = pdfDataUrl;
        a.download = 'certificate.pdf';

        a.click();
    };

    return (
        <CardWrapper>
            <Box style={{ display: 'flex', marginBottom: '.5rem' }}>
                <Box style={{ padding: '0 .5rem' }}>
                    <img src="/certificate.png" />
                </Box>

                <Box style={{ padding: '0 .5rem' }}>
                    <Text g500 noMargin small>
                        {title}
                    </Text>
                    <Display>{cardHeading}</Display>
                </Box>
            </Box>
            <Box style={{ position: 'relative' }}>
                <Divider
                    mt="2rem"
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '-16px',
                        marginBottom: 0,
                        width: 'calc(100% + 32px)'
                    }}
                />
            </Box>

            {!isReady && (
                <Box style={{ padding: '.5rem' }}>
                    <Text
                        g500
                        noMargin
                        small
                        style={{
                            textAlign: 'center',
                            padding: '1.5rem 0 1rem'
                        }}
                    >
                        {cardTip}
                    </Text>

                    <Box
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '1rem'
                        }}
                    >
                        <Input
                            id="firstName"
                            placeholder={firstNamePlaceholder}
                            onKeyUp={(e: any) => setFirstName(e.target.value)}
                        />
                        <Input
                            id="lastName"
                            placeholder={lastNamePlaceholder}
                            onKeyUp={(e: any) => setLastName(e.target.value)}
                        />

                        <Button
                            onClick={handleConvertToPNG}
                            isLoading={loading}
                        >
                            {generate}
                        </Button>
                    </Box>
                </Box>
            )}

            {isReady && (
                <Box
                    className="certificate-buttons"
                    style={{ padding: '1.5rem 0 0' }}
                >
                    <Box
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                            flexWrap: 'wrap',
                            marginTop: '.5rem'
                        }}
                    >
                        <Button
                            gray
                            style={{ color: '#1570EF', fontWeight: 600 }}
                            onClick={() => setModalOpen(true)}
                            isLoading={loading}
                        >
                            {viewCertificate}
                        </Button>

                        <Button
                            onClick={handleConvertToPDF}
                            isLoading={loading}
                        >
                            {downloadCertificate}
                        </Button>
                    </Box>
                </Box>
            )}

            <div style={{ position: 'relative' }}>
                <div
                    id="htmlElementToCapture"
                    style={{
                        zIndex: '-1',
                        position: 'absolute',
                        width: '550px',
                        height: '387px'
                    }}
                >
                    <Certificate
                        name={`${firstName} ${lastName}`}
                        {...certificateData}
                    />
                </div>
            </div>

            <Modal
                style={{
                    width: '100%',
                    height: '100%',
                    flexDirection: 'column',
                    maxHeight: 'calc(100vw - 100px)'
                }}
                isOpen={modalOpen}
                fullW
            >
                <img
                    src={pngDataUrl}
                    style={{
                        width: '100%',
                        maxHeight: 'calc(90vh - 100px)',
                        objectFit: 'contain'
                    }}
                    alt="PNG Image"
                />

                <Box
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '2rem'
                    }}
                >
                    <Button
                        gray
                        style={{
                            background: 'white',
                            color: '#344054',
                            borderColor: '#D0D5DD'
                        }}
                        onClick={() => {
                            setModalOpen(false);
                        }}
                    >
                        {dismiss}
                    </Button>
                    <Button
                        style={{
                            marginLeft: '1rem'
                        }}
                        onClick={handleConvertToPDF}
                    >
                        {downloadCertificate}
                    </Button>
                </Box>
            </Modal>
        </CardWrapper>
    );
};

export default GenerateCertificate;
