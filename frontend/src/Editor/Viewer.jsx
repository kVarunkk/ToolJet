import React from 'react';
import { appService, authenticationService } from '@/_services';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Container } from './Container';
import { CustomDragLayer } from './CustomDragLayer';
import { DraggableBox } from './DraggableBox';
import { componentTypes } from './Components/components';
import { Inspector } from './Inspector/Inspector';

class Viewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            users: null,
            appDefinition: {
                components: {}
            }
        };
    }

    componentDidMount() {
        
        const id = this.props.match.params.id;

        appService.getApp(id).then(data => this.setState({ 
            app: data, 
            isLoading: false,
            appDefinition: data.definition
        }));

        this.setState({
            currentSidebarTab: 2,
            selectedComponent: null,
        });
    }

    switchSidebarTab = (tabIndex) => { 
        this.setState({
            currentSidebarTab: tabIndex
        });
    }

    onComponentClick = (id, component) => {
        this.setState( { selectedComponent: { id, component } } )
        this.switchSidebarTab(1);
    }

    renderComponentCard = (component, index) => {
        return (<DraggableBox key={index} index={index} component={component} />);
    };

    appDefinitionChanged = (newDefinition) => { 
        console.log('newDefinition', newDefinition);
        this.setState({ appDefinition: newDefinition })
        console.log('app definition', this.state.appDefinition);
    }

    componentDefinitionChanged = (newDefinition) => { 
        console.log('new component definition', newDefinition);
        console.log('app definition', this.state.appDefinition);
        this.setState( { 
            appDefinition: { ...this.state.appDefinition, [newDefinition.id]: { component: newDefinition.component } }
        })
    }

    saveApp = () => {
        const { app, appDefinition } = this.state;
        appService.saveApp(app.id, appDefinition).then((data) => {
            alert('saved')
        });
    }

    render() {
        const { currentSidebarTab, selectedComponent, appDefinition } = this.state;

        console.log(appDefinition);

        return (
            <div class="viewer wrapper">
                <DndProvider backend={HTML5Backend}>
                    <div className="header">
                        <header class="navbar navbar-expand-md navbar-light d-print-none">
                            <div class="container-xl header-container">
                                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                                <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                                    <a href=".">
                                    <img src="https://www.svgrepo.com/show/210145/egg.svg" width="110" height="32" alt="StackEgg" class="navbar-brand-image"/>
                                    </a>
                                </h1>
                                <div class="navbar-nav flex-row order-md-last">
                                    
                                </div>
                            </div>
                        </header>
                    </div>
                    <div className="sub-section">
                    
                    <div className="main">
                        <div className="canvas-container align-items-center">
                            <div className="canvas-area">
                                <Container 
                                    appDefinition={appDefinition}
                                    appDefinitionChanged={this.appDefinitionChanged}
                                    snapToGrid={true} 
                                    onComponentClick={this.onComponentClick}/>
			                    <CustomDragLayer snapToGrid={true}/>
                            </div>
                        </div>
                    </div>
                    </div>
                </DndProvider>    
            </div>
        );
    }
}

export { Viewer };