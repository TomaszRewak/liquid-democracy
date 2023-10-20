import { Link } from 'react-router-dom';
import { Button, Menu, Icon } from 'semantic-ui-react';

export function TopBar({ children }) {
    return (
        <Menu className='top-menu' fixed='top' borderless={true}>
            <Menu.Item position='left'>
                <Link to='/'>
                    <Button icon size='mini' className='mini' labelPosition='left'>
                        <Icon name='chart pie' />
                        liquid democracy
                    </Button>
                </Link>
            </Menu.Item>
            <Menu.Item position='right'>
                {children}
            </Menu.Item>
        </Menu>
    );
}
