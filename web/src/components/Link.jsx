export default function Link({to, title}) {
    return(
        <a href={to} className="text-sm text-gray-300 hover:text-white mr-4">{title}</a>
    )
}