import { Box } from '@impact-market/ui';

const Modal = ({ isOpen, fullW, children }: any) => {
    if (!isOpen) {
        return null;
    }

    return (
        <Box
            maxW={25}
            padding={1.5}
            w="100%"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                zIndex: '2',
                padding: '1rem',
                boxSizing: 'border-box',
                background: 'rgba(39, 39, 39, .8)',
                backdropFilter: 'blur(10px)'
            }}
        >
            <Box
                style={{
                    width: '100%',
                    maxWidth: fullW ? '100%': '21rem',
                    padding: '1.5rem',
                    border: '1px solid',
                    borderRadius: '12px',
                    background: 'white'
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Modal;
