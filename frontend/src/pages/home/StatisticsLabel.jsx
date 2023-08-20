import { Button, Icon, Label } from 'semantic-ui-react';

export function StatisticsLabel({ icon, color, value }) {
    const text = value.toFixed(1);
    const baseNumber = text.split('.')[0];
    const decimal = '.' + text.split('.')[1];

    return (
        <Button as='div' labelPosition='left' size='mini'>
            <Label as='a' basic color={color} pointing='right'>
                {baseNumber}
                <span style={{ opacity: 0.3 }}>{decimal}</span>
            </Label>
            <Button color={color} size='mini'>
                <Icon name={icon} />
            </Button>
        </Button>
    );
}
