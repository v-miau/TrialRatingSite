import { useParams } from 'react-router'

function ReviewPage() {
    const { mapId } = useParams()

    return (
        <main>
            <h1>Review for {mapId}</h1>
        </main>
    )
}

export default ReviewPage