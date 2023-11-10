import { StyleSheet } from '@react-pdf/renderer';
import { Text } from '@impact-market/ui';

const styles = StyleSheet.create({
    page: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        height: '388px'
    },
    view: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
        top: 0,
        left: 0
    },
    image: {
        width: '100%',
        height: '100%'
    },
    text2: {
        lineHeight: 2,
        fontSize: 11.5,
        fontWeight: 300
    },
    view2: {
        maxWidth: '80%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
        fontFamily: 'Abhaya Libre',
        fontWeight: 'extrabold',
        fontSize: 23,
        lineHeight: '2.75rem',
        letterSpacing: 0,
        color: '#C6A24D',
        textTransform: 'uppercase'
    }
});

const Certificate = (props: any) => {
    const {
        heading,
        supportText,
        completedOn,
        on,
        sponsor,
        title,
        completionDate
    } = props;

    const formatDateFromTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);

        // Format the date using the options parameter of toLocaleDateString
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        return formattedDate;
    };

    return (
        <div style={styles.page}>
            <div style={styles.view}>
                <img
                    style={styles.image}
                    src="/certificate-background.jpg"
                ></img>
            </div>
            <div style={styles.view2}>
                <img
                    id="sponsorImage"
                    style={{
                        width: 130,
                        height: 'auto',
                        marginBottom: '15px',
                        zIndex: 10000
                    }}
                    src={sponsor}
                />
                <p style={styles.heading}>{heading}</p>
                <Text style={{ ...styles.text2, marginTop: '-5px' }}>
                    {supportText}
                </Text>

                <p
                    style={{
                        ...styles.heading,
                        fontSize: 40,
                        margin: '35px 0 15px'
                    }}
                >
                    {props?.name}
                </p>

                <Text style={styles.text2}>{completedOn}</Text>

                <Text style={{ ...styles.text2, lineHeight: 1.5 }}>
                    <span
                        style={{
                            fontFamily: 'Inter-Inter, sans-serif',
                            fontWeight: 'bold'
                        }}
                    >
                        {title}
                    </span>
                    {` ${on} ${formatDateFromTimestamp(completionDate)}.`}
                </Text>
            </div>
        </div>
    );
};

export default Certificate;
