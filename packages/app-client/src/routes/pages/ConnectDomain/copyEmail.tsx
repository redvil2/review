export const rootEmailText = ({ domainName, name1, name2, name3, name4 }) => `
Hello,

I want to allow A4Lcloud QR code generator to auto-shorten URLs using the domain ${domainName}.

Please create the domain ${domainName}

Please replace the values of the nameservers with the following fields below:

${name1}
${name2}
${name3}
${name4}

Best regards,
`;

export const subEmailText = ({
  domainName,
  cname1,
  cvalue1,
  cname2,
  cvalue2,
}) => `
Hello,

I want to allow A4Lcloud QR code generator to auto-shorten URLs using the domain ${domainName}.

Please create the domain ${domainName}

Create CNAME records with the following values below

CNAME Record name
${cname1}
CNAME record value:
${cvalue1}

CNAME Record name
${cname2}
CNAME record value:
${cvalue2}

Best regards,
`;
