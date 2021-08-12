import React from "react"

export const formatColors = (data: JSX.Element | string) : JSX.Element => {

    if(typeof data === 'string') {
        return <>{parseStringElement((data as unknown) as string, false)}</>
    }

    let reconstructedChildrens : any[] = []

    if(data.props.children === undefined) {
        return <></>
    }

    for(let element of data.props.children) {
        if(element === undefined) continue

        if(!isElement(element) && isIterable(element)) {
            for(let subelement of element) {
                if(!isElement(subelement)) {
                    parseStringElement(subelement as string, true).forEach((e) => reconstructedChildrens.push(e))
                } else {
                    //no es un string, agregar directamente
                    reconstructedChildrens.push(parseReactElement(subelement, false))
                }
            }
        } else if(!isElement(element)) {
            parseStringElement(element as string, true).forEach((e) => reconstructedChildrens.push(e))
        } else {
            //no es un string, agregar directamente
            reconstructedChildrens.push(parseReactElement(element, false))
        }
    }

    //console.log(reconstructedChildrens)

    return React.cloneElement(
        data,
        [data.props],
        [...reconstructedChildrens]
    )
}

function parseReactElement(data: any, applyTooltipDefaultFormat: boolean = true) : JSX.Element {
    let reconstructedChildrens : any[] = [] 

    if(!isIterable(data.props.children)) {
        //console.log("No iterable: ")
        //console.log(data)
        return data as JSX.Element
    } else {
        //console.log("Iterable: ")
        //console.log(data)
    }
    
    if (typeof data.props.children === 'string' || data.props.children instanceof String) {
        parseStringElement(data.props.children as string, applyTooltipDefaultFormat).forEach((e) => reconstructedChildrens.push(e))
        return React.cloneElement(
            data,
            [data.props],
            [reconstructedChildrens]
        )
    }

    for(let element of data.props.children) {
        if(!isElement(element)) {
            parseStringElement(element as string, applyTooltipDefaultFormat).forEach((e) => reconstructedChildrens.push(e))
        } else {
            //no es un string, agregar directamente
            reconstructedChildrens.push(element)
        }
    }

    return React.cloneElement(
        data,
        [data.props],
        [reconstructedChildrens]
    )
}

function parseStringElement(element: string, applyTooltipDefaultFormat: boolean) : any[] {
    let reconstructedChildrens : any[] = []
    let elementString = element as string
    let chars = Array.from(elementString)
    let nextFormatCodeCheck = false
    let stringToAppend = ""
    let applicableFormats : string[] = []

    let reconstructChildrensForSection = (defaultTooltipColor : boolean = true) => {
        if(stringToAppend.length > 0) {
            if(applicableFormats.length === 0) {
                //no hay formatos, agregar directamente el string
                if(defaultTooltipColor) {
                    reconstructedChildrens.push(<span className="mc-5 mc-o" key={stringToAppend}>{stringToAppend}</span>)
                } else {
                    reconstructedChildrens.push(stringToAppend)
                }
            } else {
                //hay formatos
                let index = 0
                let lastElement : JSX.Element | undefined = undefined
                let toApply = applicableFormats.reverse()
                do {
                    //console.log("index => " + index + " | mc-" + toApply[index])
                    if(lastElement === undefined) {
                        lastElement = <span className={"mc-" + toApply[index]} key={stringToAppend}>{stringToAppend}</span>
                    } else {
                        //console.log("complex rebuild | " + stringToAppend)
                        lastElement = <span className={"mc-" + toApply[index]} key={stringToAppend}>{lastElement}</span>
                    }
                    index++
                } while(index < toApply.length)

                reconstructedChildrens.push(lastElement)
            }
        }
    }

    for(let c of chars) {
        if(c === '&') {
            if(nextFormatCodeCheck) {
                stringToAppend += "&"
            }
            nextFormatCodeCheck = true
        } else if(nextFormatCodeCheck) {
            if(isMinecraftColor(c) || isMinecraftFormat(c)) {
                //insertar todos los formatos aplicables
                reconstructChildrensForSection(applyTooltipDefaultFormat)
                
                stringToAppend = ""
                if(isMinecraftFormat(c)) {
                    //agregar este formato (solo si no se ha agregado previamente)
                    if(applicableFormats.find((e) => e === c) === undefined) {
                        applicableFormats.push(c)
                    }
                } else {
                    //cuando se trata de un color se reinicia todos los formatos, solo preservar el color actual
                    applicableFormats = [c]
                }
            } else {
                stringToAppend += "&"
                stringToAppend += c
            }

            nextFormatCodeCheck = false
        } else {
            if(c === " ") {
                stringToAppend += "\u00a0"
            } else {
                stringToAppend += c
            }
        }
    }

    if(nextFormatCodeCheck) {
        stringToAppend += "&"
    }

    //insertar todos los formatos aplicables si al final de la operación hay texto por agregar
    reconstructChildrensForSection(applyTooltipDefaultFormat)

    return reconstructedChildrens
}

function isMinecraftColor(char: string) : boolean {
    return char === 'a' ||
        char === 'b' ||
        char === 'c' ||
        char === 'd' ||
        char === 'e' ||
        char === 'f' ||
        char === '1' ||
        char === '2' ||
        char === '3' ||
        char === '4' ||
        char === '5' ||
        char === '6' ||
        char === '7' ||
        char === '8' ||
        char === '9' ||
        char === '0'
}

function isMinecraftFormat(char: string) : boolean {
    return char === 'l' ||
        char === 'o' ||
        char === 'm' ||
        char === 'n'
}

/*function isClassComponent(component : any) {
    return (
        typeof component === 'function' && 
        !!component.prototype.isReactComponent
    )
}

function isFunctionComponent(component : any) {
    return (
        typeof component === 'function' && 
        String(component).includes('return React.createElement')
    )
}

function isReactComponent(component : any) {
    return (
        isClassComponent(component) || 
        isFunctionComponent(component)
    )
}*/ //UNUSED

function isElement(element : any) {
    return React.isValidElement(element);
}

/*function isDOMTypeElement(element : any) {
    return isElement(element) && typeof element.type === 'string';
}

function isCompositeTypeElement(element : any) {
    return isElement(element) && typeof element.type === 'function';
}*/ //UNUSED

function isIterable (value : any) {
    return Symbol.iterator in Object(value);
  }