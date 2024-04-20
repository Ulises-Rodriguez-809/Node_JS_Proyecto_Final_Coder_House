const generateGetTicketError = (email) => {
    return `
    No se logro obtener el ticket del comprado: ${email}
    `
}

const generateCreateTicketError = () => {
    return `
    No se logro crear el ticket
    `
}

const ticketErrorOptions = {
    generateGetTicketError,
    generateCreateTicketError,
}

export default ticketErrorOptions;